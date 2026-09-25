import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Arrow, Circle, Ellipse, Image as KonvaImage, Layer, Line, Rect, RegularPolygon, Stage, Star, Text, Transformer } from 'react-konva';
import { useNavigate } from 'react-router-dom';

const PAGE_WIDTH = 1920;
const PAGE_HEIGHT = 1080;
const DB_NAME = 'athar-teacher-board';
const STORE_NAME = 'boards';
const PROJECT_KEY = 'default-board';

type Tool = 'select' | 'pen' | 'highlighter' | 'eraser' | 'text' | 'shape' | 'laser';
type ShapeKind = 'rectangle' | 'ellipse' | 'triangle' | 'star' | 'line' | 'arrow';
type BackgroundKind = 'white' | 'offwhite' | 'dark' | 'grid' | 'graph';
type DrawerTab = 'general' | 'teaching' | 'math' | 'files';
type TimerMode = 'countdown' | 'stopwatch';
type OverlayKind = 'ruler' | 'protractor';

interface BaseElement {
  id: string;
  x: number;
  y: number;
  rotation: number;
  locked?: boolean;
}

interface StrokeElement extends BaseElement {
  type: 'stroke';
  points: number[];
  color: string;
  width: number;
  highlighter?: boolean;
}

interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  color: string;
  width: number;
  height: number;
  fontSize: number;
}

interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeKind: ShapeKind;
  color: string;
  fill: string;
  width: number;
  height: number;
  points?: number[];
}

interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
  width: number;
  height: number;
}

type BoardElement = StrokeElement | TextElement | ShapeElement | ImageElement;

interface BoardProject {
  schemaVersion: 1;
  title: string;
  background: BackgroundKind;
  elements: BoardElement[];
  updatedAt: string;
}

interface OverlayPosition {
  x: number;
  y: number;
  rotation: number;
}

const reinforcementMessages = [
  'أحسنت! إجابة رائعة ⭐',
  'ممتاز! استمر 👏',
  'تفكير جميل جدًا 💡',
  'محاولة قوية… جرّب مرة أخرى 💪',
  'برافو! تقدّم رائع 🌟',
];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function backgroundColor(background: BackgroundKind) {
  if (background === 'dark') return '#15221B';
  if (background === 'offwhite') return '#FBF8F0';
  return '#FFFFFF';
}

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function openBoardDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveLocalBoard(project: BoardProject) {
  const db = await openBoardDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(project, PROJECT_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function loadLocalBoard(): Promise<BoardProject | null> {
  const db = await openBoardDb();
  const project = await new Promise<BoardProject | null>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(PROJECT_KEY);
    request.onsuccess = () => resolve((request.result as BoardProject | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return project;
}

function downloadBlob(content: BlobPart, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function BoardImageNode({ element, commonProps }: { element: ImageElement; commonProps: Record<string, unknown> }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const next = new window.Image();
    next.onload = () => setImage(next);
    next.src = element.src;
    return () => {
      next.onload = null;
    };
  }, [element.src]);

  return image ? <KonvaImage image={image} width={element.width} height={element.height} {...commonProps} /> : null;
}

export function BoardPage() {
  const navigate = useNavigate();
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasFrameRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const projectInputRef = useRef<HTMLInputElement | null>(null);
  const eraserSnapshotRef = useRef<BoardElement[] | null>(null);
  const eraserHistoryCommittedRef = useRef(false);
  const reinforcementTimeoutRef = useRef<number | null>(null);

  const [elements, setElements] = useState<BoardElement[]>([]);
  const [past, setPast] = useState<BoardElement[][]>([]);
  const [future, setFuture] = useState<BoardElement[][]>([]);
  const [tool, setTool] = useState<Tool>('pen');
  const [shapeKind, setShapeKind] = useState<ShapeKind>('rectangle');
  const [color, setColor] = useState('#111111');
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [background, setBackground] = useState<BackgroundKind>('white');
  const [zoom, setZoom] = useState(52);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [textEditor, setTextEditor] = useState<{ x: number; y: number; value: string } | null>(null);
  const [presenting, setPresenting] = useState(false);
  const [presentationLocked, setPresentationLocked] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState('جارٍ تحميل آخر سبورة…');
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('general');

  const [timerOpen, setTimerOpen] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>('countdown');
  const [timerPreset, setTimerPreset] = useState(180);
  const [timerValue, setTimerValue] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);

  const [reinforcementOpen, setReinforcementOpen] = useState(false);
  const [reinforcementMessage, setReinforcementMessage] = useState<string | null>(null);
  const [rewardCount, setRewardCount] = useState(0);

  const [spotlightEnabled, setSpotlightEnabled] = useState(false);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 520, y: 320 });
  const [curtainEnabled, setCurtainEnabled] = useState(false);
  const [curtainHeight, setCurtainHeight] = useState(45);
  const [laserPoint, setLaserPoint] = useState<{ x: number; y: number } | null>(null);

  const [rulerVisible, setRulerVisible] = useState(false);
  const [protractorVisible, setProtractorVisible] = useState(false);
  const [rulerPosition, setRulerPosition] = useState<OverlayPosition>({ x: 35, y: 78, rotation: 0 });
  const [protractorPosition, setProtractorPosition] = useState<OverlayPosition>({ x: 62, y: 62, rotation: 0 });
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcStored, setCalcStored] = useState<number | null>(null);
  const [calcOperation, setCalcOperation] = useState<'+' | '-' | '×' | '÷' | null>(null);

  const scale = zoom / 100;
  const selectedElement = useMemo(() => elements.find((element) => element.id === selectedId) ?? null, [elements, selectedId]);

  const gridLines = useMemo(() => {
    if (background !== 'grid' && background !== 'graph') return [] as Array<{ points: number[]; strong: boolean }>;
    const step = background === 'grid' ? 80 : 40;
    const lines: Array<{ points: number[]; strong: boolean }> = [];
    for (let x = step; x < PAGE_WIDTH; x += step) lines.push({ points: [x, 0, x, PAGE_HEIGHT], strong: background === 'graph' && x % 200 === 0 });
    for (let y = step; y < PAGE_HEIGHT; y += step) lines.push({ points: [0, y, PAGE_WIDTH, y], strong: background === 'graph' && y % 200 === 0 });
    return lines;
  }, [background]);

  const commitElements = useCallback((next: BoardElement[]) => {
    setPast((current) => [...current.slice(-99), elements]);
    setFuture([]);
    setElements(next);
    setSaveStatus('غير محفوظ');
  }, [elements]);

  const replaceElement = useCallback((id: string, updater: (element: BoardElement) => BoardElement) => {
    commitElements(elements.map((element) => (element.id === id ? updater(element) : element)));
  }, [commitElements, elements]);

  const showReinforcement = useCallback((message: string, addReward = true) => {
    setReinforcementMessage(message);
    if (addReward) setRewardCount((current) => current + 1);
    if (reinforcementTimeoutRef.current) window.clearTimeout(reinforcementTimeoutRef.current);
    reinforcementTimeoutRef.current = window.setTimeout(() => setReinforcementMessage(null), 2800);
  }, []);

  useEffect(() => () => {
    if (reinforcementTimeoutRef.current) window.clearTimeout(reinforcementTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setTimerValue((current) => {
        if (timerMode === 'stopwatch') return current + 1;
        if (current <= 1) {
          setTimerRunning(false);
          showReinforcement('⏰ انتهى الوقت!', false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [showReinforcement, timerMode, timerRunning]);

  useEffect(() => {
    let active = true;
    loadLocalBoard()
      .then((project) => {
        if (!active) return;
        if (project?.schemaVersion === 1 && Array.isArray(project.elements)) {
          setElements(project.elements);
          setBackground(project.background ?? 'white');
          setSaveStatus('تم استرداد آخر سبورة محفوظة محليًا');
        } else {
          setSaveStatus('سبورة جديدة');
        }
      })
      .catch(() => setSaveStatus('تعذر استرداد الحفظ المحلي — يمكنك العمل والتنزيل يدويًا'))
      .finally(() => active && setHydrated(true));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSaveStatus('جارٍ الحفظ…');
    const timer = window.setTimeout(() => {
      saveLocalBoard({
        schemaVersion: 1,
        title: 'السبورة التعليمية',
        background,
        elements,
        updatedAt: new Date().toISOString(),
      })
        .then(() => setSaveStatus('محفوظ محليًا'))
        .catch(() => setSaveStatus('تعذر الحفظ المحلي — نزّل ملف السبورة للاحتفاظ بعملك'));
    }, 750);
    return () => window.clearTimeout(timer);
  }, [background, elements, hydrated]);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage || !selectedId || selectedElement?.type === 'stroke') {
      transformer?.nodes([]);
      return;
    }
    const node = stage.findOne(`#${selectedId}`);
    transformer.nodes(node ? [node] : []);
    transformer.getLayer()?.batchDraw();
  }, [selectedElement, selectedId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
        return;
      }
      const key = event.key.toLowerCase();
      if (key === 'v') setTool('select');
      if (key === 'p') setTool('pen');
      if (key === 'h') setTool('highlighter');
      if (key === 'e') setTool('eraser');
      if (key === 't') setTool('text');
      if (key === 's') setTool('shape');
      if (event.key === 'Delete' && selectedId) {
        commitElements(elements.filter((element) => element.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const pointFromStage = () => {
    const pointer = stageRef.current?.getPointerPosition();
    if (!pointer) return null;
    return { x: pointer.x / scale, y: pointer.y / scale };
  };

  const eraseAtPointer = () => {
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!stage || !pointer) return;
    const hit = stage.getIntersection(pointer);
    const name = String(hit?.name?.() ?? '');
    if (!name.startsWith('stroke:')) return;
    const id = name.slice('stroke:'.length);
    if (!eraserHistoryCommittedRef.current && eraserSnapshotRef.current) {
      setPast((current) => [...current.slice(-99), eraserSnapshotRef.current as BoardElement[]]);
      setFuture([]);
      eraserHistoryCommittedRef.current = true;
    }
    setElements((current) => current.filter((element) => element.id !== id));
    setSaveStatus('غير محفوظ');
  };

  const handlePointerDown = (event: any) => {
    if (presenting && presentationLocked) return;
    const point = pointFromStage();
    if (!point) return;

    if (tool === 'select') {
      if (event.target === event.target.getStage()) setSelectedId(null);
      return;
    }

    if (tool === 'laser') {
      setLaserPoint(point);
      return;
    }

    if (tool === 'text') {
      setTextEditor({ x: point.x, y: point.y, value: '' });
      return;
    }

    if (tool === 'eraser') {
      eraserSnapshotRef.current = elements;
      eraserHistoryCommittedRef.current = false;
      eraseAtPointer();
      return;
    }

    if (tool === 'pen' || tool === 'highlighter') {
      const id = createId('stroke');
      const stroke: StrokeElement = {
        id,
        type: 'stroke',
        x: 0,
        y: 0,
        rotation: 0,
        points: [point.x, point.y, point.x, point.y],
        color,
        width: tool === 'highlighter' ? strokeWidth * 2.2 : strokeWidth,
        highlighter: tool === 'highlighter',
      };
      commitElements([...elements, stroke]);
      setDrawingId(id);
      return;
    }

    if (tool === 'shape') {
      const id = createId('shape');
      const shape: ShapeElement = {
        id,
        type: 'shape',
        shapeKind,
        x: point.x,
        y: point.y,
        rotation: 0,
        width: 2,
        height: 2,
        points: shapeKind === 'line' || shapeKind === 'arrow' ? [0, 0, 2, 2] : undefined,
        color,
        fill: 'transparent',
      };
      commitElements([...elements, shape]);
      setDrawingId(id);
      setShapeStart(point);
    }
  };

  const handlePointerMove = () => {
    const point = pointFromStage();
    if (!point) return;
    if (tool === 'laser') {
      setLaserPoint(point);
      return;
    }
    if (tool === 'eraser' && eraserSnapshotRef.current) {
      eraseAtPointer();
      return;
    }
    if (!drawingId) return;

    setElements((current) => current.map((element) => {
      if (element.id !== drawingId) return element;
      if (element.type === 'stroke') return { ...element, points: [...element.points, point.x, point.y] };
      if (element.type === 'shape' && shapeStart) {
        const dx = point.x - shapeStart.x;
        const dy = point.y - shapeStart.y;
        if (element.shapeKind === 'line' || element.shapeKind === 'arrow') return { ...element, points: [0, 0, dx, dy] };
        return {
          ...element,
          x: dx < 0 ? point.x : shapeStart.x,
          y: dy < 0 ? point.y : shapeStart.y,
          width: Math.max(2, Math.abs(dx)),
          height: Math.max(2, Math.abs(dy)),
        };
      }
      return element;
    }));
  };

  const handlePointerUp = () => {
    setDrawingId(null);
    setShapeStart(null);
    eraserSnapshotRef.current = null;
    eraserHistoryCommittedRef.current = false;
  };

  const undo = () => {
    if (!past.length) return;
    const previous = past[past.length - 1];
    setFuture((current) => [elements, ...current].slice(0, 100));
    setElements(previous);
    setPast((current) => current.slice(0, -1));
    setSelectedId(null);
    setSaveStatus('غير محفوظ');
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setPast((current) => [...current, elements].slice(-100));
    setElements(next);
    setFuture((current) => current.slice(1));
    setSelectedId(null);
    setSaveStatus('غير محفوظ');
  };

  const clearBoard = () => {
    if (!elements.length) return;
    if (!window.confirm(`سيتم مسح ${elements.length} عنصرًا من السبورة. يمكنك التراجع بعد المسح. هل تريد المتابعة؟`)) return;
    commitElements([]);
    setSelectedId(null);
  };

  const saveText = () => {
    const value = textEditor?.value.trim();
    if (!textEditor || !value) {
      setTextEditor(null);
      return;
    }
    const element: TextElement = {
      id: createId('text'),
      type: 'text',
      x: textEditor.x,
      y: textEditor.y,
      rotation: 0,
      text: value,
      color,
      width: 560,
      height: 150,
      fontSize: 52,
    };
    commitElements([...elements, element]);
    setTextEditor(null);
    setTool('select');
  };

  const addImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('اختر ملف صورة صالحًا.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      window.alert('حجم الصورة أكبر من 20MB. صغّر الصورة أولًا ثم حاول مرة أخرى.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result ?? '');
      const image = new window.Image();
      image.onload = () => {
        const ratio = Math.min(1, 820 / image.width, 560 / image.height);
        const width = Math.max(120, image.width * ratio);
        const height = Math.max(90, image.height * ratio);
        const element: ImageElement = {
          id: createId('image'),
          type: 'image',
          x: (PAGE_WIDTH - width) / 2,
          y: (PAGE_HEIGHT - height) / 2,
          rotation: 0,
          src,
          alt: file.name,
          width,
          height,
        };
        commitElements([...elements, element]);
        setSelectedId(element.id);
        setTool('select');
      };
      image.src = src;
    };
    reader.readAsDataURL(file);
  };

  const downloadProject = () => {
    const project: BoardProject = {
      schemaVersion: 1,
      title: 'السبورة التعليمية',
      background,
      elements,
      updatedAt: new Date().toISOString(),
    };
    downloadBlob(JSON.stringify(project, null, 2), 'سبورتي.utbboard', 'application/json;charset=utf-8');
  };

  const openProject = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      window.alert('ملف السبورة أكبر من 25MB ولا يمكن فتحه بأمان.');
      return;
    }
    file.text().then((content) => {
      try {
        const project = JSON.parse(content) as BoardProject;
        if (project.schemaVersion !== 1 || !Array.isArray(project.elements)) throw new Error('invalid');
        setPast((current) => [...current.slice(-99), elements]);
        setElements(project.elements);
        setBackground(project.background ?? 'white');
        setFuture([]);
        setSelectedId(null);
        setSaveStatus('تم فتح ملف السبورة');
      } catch {
        window.alert('تعذر فتح الملف. تأكد أنه ملف .utbboard صالح من هذه السبورة.');
      }
    });
  };

  const exportPng = () => {
    const stage = stageRef.current;
    if (!stage) return;
    try {
      const oldWidth = stage.width();
      const oldHeight = stage.height();
      const oldScale = stage.scaleX();
      stage.width(PAGE_WIDTH);
      stage.height(PAGE_HEIGHT);
      stage.scale({ x: 1, y: 1 });
      stage.batchDraw();
      const dataUrl = stage.toDataURL({ pixelRatio: 1 });
      stage.width(oldWidth);
      stage.height(oldHeight);
      stage.scale({ x: oldScale, y: oldScale });
      stage.batchDraw();
      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = 'السبورة-التعليمية.png';
      anchor.click();
    } catch {
      window.alert('تعذر تصدير الصورة الآن. نزّل ملف السبورة للاحتفاظ بعملك.');
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await rootRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      window.alert('تعذر تشغيل ملء الشاشة في هذا المتصفح. يمكنك الاستمرار داخل النافذة بشكل طبيعي.');
    }
  };

  const setCountdownPreset = (seconds: number) => {
    setTimerMode('countdown');
    setTimerPreset(seconds);
    setTimerValue(seconds);
    setTimerRunning(false);
  };

  const switchTimerMode = (mode: TimerMode) => {
    setTimerMode(mode);
    setTimerRunning(false);
    setTimerValue(mode === 'countdown' ? timerPreset : 0);
  };

  const calcPressDigit = (digit: string) => {
    setCalcDisplay((current) => current === '0' ? digit : `${current}${digit}`);
  };

  const calcChooseOperation = (operation: '+' | '-' | '×' | '÷') => {
    setCalcStored(Number(calcDisplay));
    setCalcOperation(operation);
    setCalcDisplay('0');
  };

  const calcEquals = () => {
    if (calcStored === null || !calcOperation) return;
    const current = Number(calcDisplay);
    let result = current;
    if (calcOperation === '+') result = calcStored + current;
    if (calcOperation === '-') result = calcStored - current;
    if (calcOperation === '×') result = calcStored * current;
    if (calcOperation === '÷') result = current === 0 ? NaN : calcStored / current;
    setCalcDisplay(Number.isFinite(result) ? String(Number(result.toFixed(8))) : 'خطأ');
    setCalcStored(null);
    setCalcOperation(null);
  };

  const startOverlayDrag = (kind: OverlayKind, event: React.PointerEvent<HTMLElement>) => {
    event.preventDefault();
    const frame = canvasFrameRef.current;
    if (!frame) return;
    const move = (moveEvent: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((moveEvent.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(8, Math.min(92, ((moveEvent.clientY - rect.top) / rect.height) * 100));
      if (kind === 'ruler') setRulerPosition((current) => ({ ...current, x, y }));
      else setProtractorPosition((current) => ({ ...current, x, y }));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const renderElement = (element: BoardElement) => {
    const commonProps = {
      id: element.id,
      key: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation,
      draggable: tool === 'select' && !element.locked && !(presenting && presentationLocked),
      onClick: () => tool === 'select' && setSelectedId(element.id),
      onTap: () => tool === 'select' && setSelectedId(element.id),
      onDragEnd: (event: any) => replaceElement(element.id, (current) => ({ ...current, x: event.target.x(), y: event.target.y() })),
      onTransformEnd: (event: any) => {
        const node = event.target;
        const nextWidth = Math.max(20, node.width() * node.scaleX());
        const nextHeight = Math.max(20, node.height() * node.scaleY());
        node.scaleX(1);
        node.scaleY(1);
        replaceElement(element.id, (current) => ({ ...current, x: node.x(), y: node.y(), rotation: node.rotation(), width: nextWidth, height: nextHeight } as BoardElement));
      },
    };

    if (element.type === 'stroke') {
      return (
        <Line
          {...commonProps}
          name={`stroke:${element.id}`}
          points={element.points}
          stroke={element.color}
          strokeWidth={element.width}
          opacity={element.highlighter ? 0.28 : 1}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="source-over"
          hitStrokeWidth={Math.max(28, element.width + 18)}
          shadowForStrokeEnabled={false}
        />
      );
    }

    if (element.type === 'text') return <Text {...commonProps} text={element.text} fill={element.color} width={element.width} height={element.height} fontSize={element.fontSize} fontFamily="Arial, sans-serif" align="right" verticalAlign="top" />;
    if (element.type === 'image') return <BoardImageNode element={element} commonProps={commonProps} />;
    if (element.shapeKind === 'line') return <Line {...commonProps} points={element.points ?? [0, 0, element.width, element.height]} stroke={element.color} strokeWidth={6} lineCap="round" />;
    if (element.shapeKind === 'arrow') return <Arrow {...commonProps} points={element.points ?? [0, 0, element.width, element.height]} stroke={element.color} fill={element.color} strokeWidth={6} pointerLength={28} pointerWidth={24} />;
    if (element.shapeKind === 'ellipse') return <Ellipse {...commonProps} radiusX={element.width / 2} radiusY={element.height / 2} offsetX={-element.width / 2} offsetY={-element.height / 2} stroke={element.color} strokeWidth={6} fill={element.fill} />;
    if (element.shapeKind === 'triangle') return <RegularPolygon {...commonProps} sides={3} radius={Math.max(20, Math.min(element.width, element.height) / 2)} offsetX={-element.width / 2} offsetY={-element.height / 2} stroke={element.color} strokeWidth={6} fill={element.fill} />;
    if (element.shapeKind === 'star') return <Star {...commonProps} numPoints={5} innerRadius={Math.max(12, Math.min(element.width, element.height) * .2)} outerRadius={Math.max(24, Math.min(element.width, element.height) * .5)} offsetX={-element.width / 2} offsetY={-element.height / 2} stroke={element.color} strokeWidth={6} fill={element.fill} />;
    return <Rect {...commonProps} width={element.width} height={element.height} stroke={element.color} strokeWidth={6} fill={element.fill} />;
  };

  const selectedCanTransform = selectedElement && selectedElement.type !== 'stroke' && !(selectedElement.type === 'shape' && (selectedElement.shapeKind === 'line' || selectedElement.shapeKind === 'arrow'));
  const toolLabel = tool === 'pen' ? 'قلم' : tool === 'highlighter' ? 'تمييز' : tool === 'eraser' ? 'ممحاة' : tool === 'text' ? 'نص' : tool === 'shape' ? 'أشكال / خطوط' : tool === 'laser' ? 'ليزر' : 'تحديد';

  return (
    <div className={`teaching-board${presenting ? ' teaching-board--presenting' : ''}`} ref={rootRef}>
      <input accept="image/*" hidden ref={imageInputRef} type="file" onChange={(event) => { addImage(event.target.files?.[0]); event.currentTarget.value = ''; }} />
      <input accept=".utbboard,application/json" hidden ref={projectInputRef} type="file" onChange={(event) => { openProject(event.target.files?.[0]); event.currentTarget.value = ''; }} />

      <header className="board-topbar">
        <button className="board-control board-control--back" onClick={() => navigate('/')} type="button">← العودة للتطبيق</button>
        <div className="board-title-wrap">
          <h1 id="page-title" tabIndex={-1}>السبورة التعليمية</h1>
          <span className="board-save-status" aria-live="polite">{saveStatus}</span>
        </div>
        <div className="board-top-actions">
          <button className="board-control" disabled={!past.length} onClick={undo} type="button">↶ تراجع</button>
          <button className="board-control" disabled={!future.length} onClick={redo} type="button">↷ إعادة</button>
          <button className="board-control" onClick={() => { setPresenting((value) => !value); setPresentationLocked(true); setSelectedId(null); setMoreOpen(false); }} type="button">{presenting ? 'إنهاء الشرح' : 'وضع الشرح'}</button>
          <button className="board-control" onClick={toggleFullscreen} type="button">ملء الشاشة</button>
          {!presenting && <button className="board-control board-control--accent" onClick={exportPng} type="button">حفظ PNG</button>}
        </div>
      </header>

      {presenting ? (
        <div className="board-presenter-bar" aria-label="أدوات وضع الشرح">
          <button className="board-control" onClick={() => setPresentationLocked((value) => !value)} type="button">{presentationLocked ? '🔒 فتح القفل' : '🔓 قفل العناصر'}</button>
          <button className={`board-control${tool === 'pen' ? ' is-active' : ''}`} disabled={presentationLocked} onClick={() => setTool('pen')} type="button">قلم</button>
          <button className={`board-control${tool === 'eraser' ? ' is-active' : ''}`} disabled={presentationLocked} onClick={() => setTool('eraser')} type="button">ممحاة</button>
          <button className="board-control" disabled={!past.length} onClick={undo} type="button">تراجع</button>
          <button className="board-control" onClick={() => setZoom(52)} type="button">ملاءمة</button>
        </div>
      ) : (
        <div className="board-toolbar" role="toolbar" aria-label="أدوات السبورة">
          {([
            ['select', 'تحديد', '⌖'],
            ['pen', 'قلم', '✎'],
            ['highlighter', 'تمييز', '▰'],
            ['eraser', 'ممحاة', '⌫'],
            ['text', 'نص', 'T'],
          ] as Array<[Tool, string, string]>).map(([id, label, icon]) => (
            <button aria-pressed={tool === id} className={`board-tool${tool === id ? ' is-active' : ''}`} key={id} onClick={() => { setTool(id); setLaserPoint(null); }} type="button"><span aria-hidden="true">{icon}</span>{label}</button>
          ))}
          <div className="board-shape-menu">
            <button aria-pressed={tool === 'shape'} className={`board-tool${tool === 'shape' ? ' is-active' : ''}`} onClick={() => setTool('shape')} type="button"><span aria-hidden="true">◇</span>أشكال / خطوط</button>
            {tool === 'shape' && (
              <select aria-label="نوع الشكل" value={shapeKind} onChange={(event) => setShapeKind(event.target.value as ShapeKind)}>
                <option value="rectangle">مستطيل</option>
                <option value="ellipse">بيضاوي</option>
                <option value="triangle">مثلث</option>
                <option value="star">نجمة</option>
                <option value="line">خط</option>
                <option value="arrow">سهم</option>
              </select>
            )}
          </div>
          <div className="board-color-swatches" aria-label="ألوان سريعة">
            {['#111111', '#D32F2F', '#1565C0', '#2E7D32', '#F58220'].map((swatch) => (
              <button aria-label={`استخدم اللون ${swatch}`} aria-pressed={color === swatch} key={swatch} onClick={() => setColor(swatch)} style={{ background: swatch }} type="button" />
            ))}
          </div>
          <select aria-label="سماكة القلم" className="board-width-select" value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))}>
            <option value={4}>رفيع</option><option value={8}>متوسط</option><option value={14}>سميك</option>
          </select>
          <button aria-expanded={moreOpen} className={`board-tool board-more-trigger${moreOpen ? ' is-active' : ''}`} onClick={() => setMoreOpen((value) => !value)} type="button"><span aria-hidden="true">☰</span>المزيد</button>
        </div>
      )}

      <div className="board-teaching-strip" aria-label="أدوات الشرح السريعة">
        <button className={timerOpen ? 'is-active' : ''} onClick={() => setTimerOpen((value) => !value)} type="button"><b>⏱</b><span>المؤقت</span></button>
        <button className={reinforcementOpen ? 'is-active' : ''} onClick={() => setReinforcementOpen((value) => !value)} type="button"><b>⭐</b><span>التشجيع</span></button>
        <button className={tool === 'laser' ? 'is-active' : ''} onClick={() => { setTool((current) => current === 'laser' ? 'select' : 'laser'); setLaserPoint(null); }} type="button"><b>●</b><span>ليزر</span></button>
        <button className={spotlightEnabled ? 'is-active' : ''} onClick={() => setSpotlightEnabled((value) => !value)} type="button"><b>◉</b><span>تركيز</span></button>
        <button className={curtainEnabled ? 'is-active' : ''} onClick={() => setCurtainEnabled((value) => !value)} type="button"><b>▥</b><span>ستارة</span></button>
        <button className={rulerVisible ? 'is-active' : ''} onClick={() => setRulerVisible((value) => !value)} type="button"><b>📏</b><span>مسطرة</span></button>
        <button className={protractorVisible ? 'is-active' : ''} onClick={() => setProtractorVisible((value) => !value)} type="button"><b>∠</b><span>منقلة</span></button>
        <button className={calculatorOpen ? 'is-active' : ''} onClick={() => setCalculatorOpen((value) => !value)} type="button"><b>±</b><span>حاسبة</span></button>
      </div>

      {moreOpen && !presenting && (
        <aside className="board-tools-drawer" aria-label="كل أدوات السبورة">
          <div className="board-tools-drawer__head">
            <div><strong>كل الأدوات</strong><small>اختر ما تحتاجه أثناء الشرح</small></div>
            <button aria-label="إغلاق لوحة الأدوات" onClick={() => setMoreOpen(false)} type="button">×</button>
          </div>
          <div className="board-tools-tabs" role="tablist" aria-label="مجموعات الأدوات">
            {([
              ['general', 'عام'], ['teaching', 'شرح وتفاعل'], ['math', 'رياضيات'], ['files', 'ملفات وحفظ'],
            ] as Array<[DrawerTab, string]>).map(([id, label]) => (
              <button aria-selected={drawerTab === id} className={drawerTab === id ? 'is-active' : ''} key={id} onClick={() => setDrawerTab(id)} role="tab" type="button">{label}</button>
            ))}
          </div>

          {drawerTab === 'general' && (
            <div className="board-drawer-section">
              <h3>الرسم والكتابة</h3>
              <div className="board-option-row">
                <label>اللون <input aria-label="لون الرسم" type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
                <label>السماكة<select value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))}><option value={4}>رفيع</option><option value={8}>متوسط</option><option value={14}>سميك</option></select></label>
              </div>
              <h3>الخلفية</h3>
              <div className="board-background-grid">
                {([
                  ['white', 'أبيض'], ['offwhite', 'فاتح دافئ'], ['dark', 'داكن'], ['grid', 'شبكة'], ['graph', 'ورق بياني'],
                ] as Array<[BackgroundKind, string]>).map(([id, label]) => <button aria-pressed={background === id} key={id} onClick={() => setBackground(id)} type="button">{label}</button>)}
              </div>
              <h3>إضافة</h3>
              <div className="board-option-grid"><button onClick={() => imageInputRef.current?.click()} type="button">إضافة صورة من الجهاز</button><button onClick={() => { setTextEditor({ x: 260, y: 220, value: '' }); setMoreOpen(false); }} type="button">إضافة نص كبير</button></div>
            </div>
          )}

          {drawerTab === 'teaching' && (
            <div className="board-drawer-section">
              <h3>أدوات الشرح والتفاعل</h3>
              <div className="board-tool-cards">
                <button onClick={() => { setTimerOpen(true); setMoreOpen(false); }} type="button"><b>⏱ المؤقت</b><span>عد تنازلي أو ساعة إيقاف</span></button>
                <button onClick={() => { setReinforcementOpen(true); setMoreOpen(false); }} type="button"><b>⭐ التشجيع والتعزيز</b><span>رسائل فورية ونجوم تحفيزية</span></button>
                <button aria-pressed={spotlightEnabled} onClick={() => setSpotlightEnabled((value) => !value)} type="button"><b>◉ دائرة التركيز</b><span>تعتيم الشاشة حول نقطة الشرح</span></button>
                <button aria-pressed={curtainEnabled} onClick={() => setCurtainEnabled((value) => !value)} type="button"><b>▥ الستارة</b><span>إخفاء جزء من المحتوى وكشفه تدريجيًا</span></button>
                <button aria-pressed={tool === 'laser'} onClick={() => setTool(tool === 'laser' ? 'select' : 'laser')} type="button"><b>● مؤشر ليزر</b><span>يتحرك دون ترك أثر</span></button>
                <button onClick={() => { setPresenting(true); setPresentationLocked(true); setMoreOpen(false); }} type="button"><b>▣ وضع الشرح</b><span>واجهة أبسط للشاشة الذكية</span></button>
              </div>
              {curtainEnabled && <label className="board-range-label">مقدار التغطية <input min="10" max="90" type="range" value={curtainHeight} onChange={(event) => setCurtainHeight(Number(event.target.value))} /><span>{curtainHeight}%</span></label>}
            </div>
          )}

          {drawerTab === 'math' && (
            <div className="board-drawer-section">
              <h3>أدوات الرياضيات والرسم</h3>
              <div className="board-tool-cards">
                <button aria-pressed={rulerVisible} onClick={() => setRulerVisible((value) => !value)} type="button"><b>📏 المسطرة</b><span>مسطرة شفافة قابلة للسحب والدوران</span></button>
                <button aria-pressed={protractorVisible} onClick={() => setProtractorVisible((value) => !value)} type="button"><b>∠ المنقلة</b><span>منقلة مرئية قابلة للسحب والدوران</span></button>
                <button aria-pressed={calculatorOpen} onClick={() => setCalculatorOpen((value) => !value)} type="button"><b>± الحاسبة</b><span>عمليات أساسية سريعة</span></button>
                <button aria-pressed={background === 'grid'} onClick={() => setBackground('grid')} type="button"><b># شبكة مربعات</b><span>خلفية مساعدة للرسم الهندسي</span></button>
                <button aria-pressed={background === 'graph'} onClick={() => setBackground('graph')} type="button"><b>▦ ورق بياني</b><span>شبكة دقيقة مع خطوط رئيسة</span></button>
              </div>
              {rulerVisible && <div className="board-rotation-control"><span>تدوير المسطرة</span><button onClick={() => setRulerPosition((current) => ({ ...current, rotation: current.rotation - 15 }))} type="button">−15°</button><button onClick={() => setRulerPosition((current) => ({ ...current, rotation: current.rotation + 15 }))} type="button">+15°</button></div>}
              {protractorVisible && <div className="board-rotation-control"><span>تدوير المنقلة</span><button onClick={() => setProtractorPosition((current) => ({ ...current, rotation: current.rotation - 15 }))} type="button">−15°</button><button onClick={() => setProtractorPosition((current) => ({ ...current, rotation: current.rotation + 15 }))} type="button">+15°</button></div>}
            </div>
          )}

          {drawerTab === 'files' && (
            <div className="board-drawer-section">
              <h3>الحفظ والملفات</h3>
              <div className="board-option-grid board-option-grid--single">
                <button onClick={downloadProject} type="button">تنزيل ملف السبورة .utbboard</button>
                <button onClick={() => projectInputRef.current?.click()} type="button">فتح ملف سبورة</button>
                <button onClick={exportPng} type="button">تصدير السبورة PNG</button>
                <button className="board-danger" onClick={clearBoard} type="button">مسح كل محتوى السبورة</button>
              </div>
              <p className="board-drawer-note">الحفظ التلقائي محلي على هذا الجهاز. لتنقل السبورة لجهاز آخر استخدم تنزيل ملف السبورة.</p>
            </div>
          )}
        </aside>
      )}

      {timerOpen && (
        <section className="board-floating-panel board-timer-panel" aria-label="المؤقت">
          <div className="board-floating-panel__head"><strong>المؤقت</strong><button aria-label="إغلاق المؤقت" onClick={() => setTimerOpen(false)} type="button">×</button></div>
          <div className="board-timer-modes"><button className={timerMode === 'countdown' ? 'is-active' : ''} onClick={() => switchTimerMode('countdown')} type="button">عد تنازلي</button><button className={timerMode === 'stopwatch' ? 'is-active' : ''} onClick={() => switchTimerMode('stopwatch')} type="button">ساعة إيقاف</button></div>
          <div className="board-timer-display" aria-live="polite">{formatTime(timerValue)}</div>
          {timerMode === 'countdown' && <div className="board-timer-presets">{[[60, '1 د'], [180, '3 د'], [300, '5 د'], [600, '10 د']].map(([seconds, label]) => <button key={seconds} onClick={() => setCountdownPreset(Number(seconds))} type="button">{label}</button>)}</div>}
          <div className="board-floating-actions"><button className="board-primary-mini" onClick={() => setTimerRunning((value) => !value)} type="button">{timerRunning ? 'إيقاف مؤقت' : 'ابدأ'}</button><button onClick={() => { setTimerRunning(false); setTimerValue(timerMode === 'countdown' ? timerPreset : 0); }} type="button">إعادة</button></div>
        </section>
      )}

      {reinforcementOpen && (
        <section className="board-floating-panel board-reinforcement-panel" aria-label="التشجيع والتعزيز">
          <div className="board-floating-panel__head"><strong>التشجيع والتعزيز</strong><button aria-label="إغلاق التعزيز" onClick={() => setReinforcementOpen(false)} type="button">×</button></div>
          <div className="board-reward-counter"><span>نجوم الجلسة</span><b>⭐ {rewardCount}</b><button onClick={() => setRewardCount(0)} type="button">تصفير</button></div>
          <div className="board-reinforcement-grid">{reinforcementMessages.map((message) => <button key={message} onClick={() => showReinforcement(message)} type="button">{message}</button>)}</div>
        </section>
      )}

      {calculatorOpen && (
        <section className="board-floating-panel board-calculator" aria-label="الآلة الحاسبة">
          <div className="board-floating-panel__head"><strong>حاسبة سريعة</strong><button aria-label="إغلاق الحاسبة" onClick={() => setCalculatorOpen(false)} type="button">×</button></div>
          <output className="board-calculator-display">{calcDisplay}</output>
          <div className="board-calculator-grid">
            {['7','8','9','4','5','6','1','2','3','0','.'].map((digit) => <button key={digit} onClick={() => calcPressDigit(digit)} type="button">{digit}</button>)}
            <button onClick={() => { setCalcDisplay('0'); setCalcStored(null); setCalcOperation(null); }} type="button">C</button>
            {(['+','-','×','÷'] as const).map((operation) => <button className={calcOperation === operation ? 'is-active' : ''} key={operation} onClick={() => calcChooseOperation(operation)} type="button">{operation}</button>)}
            <button className="board-calculator-equals" onClick={calcEquals} type="button">=</button>
          </div>
        </section>
      )}

      <div className="board-workspace" onContextMenu={(event) => event.preventDefault()} onPointerMove={(event) => {
        if (!spotlightEnabled) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setSpotlightPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}>
        <div className="board-canvas-scroll">
          <div className="board-canvas-frame" ref={canvasFrameRef} style={{ width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }}>
            <Stage
              height={PAGE_HEIGHT * scale}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={() => tool === 'laser' && setLaserPoint(null)}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              ref={stageRef}
              scaleX={scale}
              scaleY={scale}
              width={PAGE_WIDTH * scale}
            >
              <Layer>
                <Rect fill={backgroundColor(background)} height={PAGE_HEIGHT} listening={false} width={PAGE_WIDTH} x={0} y={0} />
                {gridLines.map((line, index) => <Line key={`grid-${index}`} listening={false} points={line.points} stroke={line.strong ? '#9DB7C9' : '#D8E3E8'} strokeWidth={line.strong ? 2.4 : 1.2} opacity={background === 'graph' ? .82 : .65} />)}
                {elements.map(renderElement)}
                {tool === 'laser' && laserPoint && <Circle fill="#E53935" listening={false} radius={15} shadowBlur={16} shadowColor="#E53935" shadowOpacity={.8} x={laserPoint.x} y={laserPoint.y} />}
                {selectedCanTransform && !presenting && (
                  <Transformer ref={transformerRef} rotateEnabled borderStroke="#F58220" anchorFill="#FFFFFF" anchorStroke="#F58220" anchorSize={18} boundBoxFunc={(oldBox, newBox) => (newBox.width < 30 || newBox.height < 30 ? oldBox : newBox)} />
                )}
              </Layer>
            </Stage>

            {curtainEnabled && <div className="board-curtain" style={{ height: `${curtainHeight}%` }}><span>اسحب نسبة الستارة من لوحة الأدوات</span></div>}
            {rulerVisible && <div className="board-ruler" onPointerDown={(event) => startOverlayDrag('ruler', event)} style={{ left: `${rulerPosition.x}%`, top: `${rulerPosition.y}%`, transform: `translate(-50%, -50%) rotate(${rulerPosition.rotation}deg)` }}><span>0</span><span>5</span><span>10</span><span>15</span><span>20</span></div>}
            {protractorVisible && <div className="board-protractor" onPointerDown={(event) => startOverlayDrag('protractor', event)} style={{ left: `${protractorPosition.x}%`, top: `${protractorPosition.y}%`, transform: `translate(-50%, -50%) rotate(${protractorPosition.rotation}deg)` }}><span className="board-protractor__label">180°</span><i /><i /><i /><i /><i /></div>}
          </div>
        </div>
        {spotlightEnabled && <div className="board-spotlight" style={{ background: `radial-gradient(circle 150px at ${spotlightPosition.x}px ${spotlightPosition.y}px, transparent 0 52%, rgba(5,10,8,.72) 78%)` }} />}
      </div>

      {!presenting && selectedElement && selectedElement.type !== 'stroke' && (
        <div className="board-selection-bar" role="group" aria-label="خصائص العنصر المحدد">
          <span>عنصر محدد</span>
          <button onClick={() => replaceElement(selectedElement.id, (element) => ({ ...element, locked: !element.locked }))} type="button">{selectedElement.locked ? 'فتح' : 'قفل'}</button>
          <button onClick={() => { const duplicate = { ...selectedElement, id: createId(selectedElement.type), x: selectedElement.x + 36, y: selectedElement.y + 36 } as BoardElement; commitElements([...elements, duplicate]); setSelectedId(duplicate.id); }} type="button">تكرار</button>
          <button className="board-danger" onClick={() => { commitElements(elements.filter((element) => element.id !== selectedElement.id)); setSelectedId(null); }} type="button">حذف</button>
        </div>
      )}

      {textEditor && (
        <div className="board-text-editor" role="dialog" aria-label="إضافة نص">
          <label htmlFor="board-text-input">اكتب النص</label>
          <textarea autoFocus dir="auto" id="board-text-input" value={textEditor.value} onChange={(event) => setTextEditor({ ...textEditor, value: event.target.value })} onKeyDown={(event) => { if (event.key === 'Escape') setTextEditor(null); if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') saveText(); }} />
          <div><button className="board-control board-control--accent" onClick={saveText} type="button">إضافة النص</button><button className="board-control" onClick={() => setTextEditor(null)} type="button">إلغاء</button></div>
        </div>
      )}

      {reinforcementMessage && (
        <div className="board-reinforcement-toast" aria-live="assertive">
          <span className="board-burst" aria-hidden="true">✦</span><strong>{reinforcementMessage}</strong><span className="board-burst board-burst--two" aria-hidden="true">★</span>
        </div>
      )}

      <footer className="board-statusbar">
        <span>الصفحة 1/1</span>
        <span>الأداة: {toolLabel}</span>
        <span className="board-zoom-control"><button disabled={zoom <= 25} onClick={() => setZoom((value) => Math.max(25, value - 10))} type="button">−</button><b>{zoom}%</b><button disabled={zoom >= 100} onClick={() => setZoom((value) => Math.min(100, value + 10))} type="button">+</button><button onClick={() => setZoom(52)} type="button">ملاءمة</button></span>
        <span>الخلفية: {background === 'white' ? 'أبيض' : background === 'offwhite' ? 'فاتح' : background === 'dark' ? 'داكن' : background === 'grid' ? 'شبكة' : 'ورق بياني'}</span>
      </footer>
    </div>
  );
}
