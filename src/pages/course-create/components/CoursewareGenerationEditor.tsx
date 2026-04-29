import { useEffect, useRef, useState } from 'react';

import type { MaterialSlide } from '@/services/dify/step4PptOutline';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const AipptIframe: {
  show: (opts: any) => any;
  close: () => void;
};

interface Props {
  onBack: () => void;
  onNext: () => void;
  courseTitle: string;
  materialSlides: MaterialSlide[];
}

const CoursewareGenerationEditor = ({
  onBack,
  onNext,
  courseTitle,
  materialSlides = [],
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setDebugInfo('正在检查 AIPPT SDK...');

        // 等待 SDK 加载（最多等待 3 秒）
        let sdkReady = false;
        for (let i = 0; i < 30; i++) {
          if (typeof (window as any).AipptIframe !== 'undefined') {
            sdkReady = true;
            setDebugInfo('AIPPT SDK 已加载');
            break;
          }
          await new Promise(r => setTimeout(r, 100));
        }

        if (!sdkReady) {
          setError('AIPPT SDK 加载失败，请刷新页面或检查网络');
          setLoading(false);
          setDebugInfo('SDK 加载超时');
          return;
        }

        setDebugInfo('正在获取 AIPPT 授权...');
        const r = await fetch('/api/aippt/code');
        const data = await r.json();
        if (cancelled) return;

        if (!r.ok || !data.code) {
          setError(data.error || `获取 AIPPT 授权失败: ${r.status}`);
          setLoading(false);
          setDebugInfo(`授权失败 ${r.status}`);
          return;
        }

        setDebugInfo('正在初始化 AIPPT 编辑器（强制跳过大纲）...');

        // 极简 Markdown，必须满足 SDK 的格式要求
        const content = `# ${courseTitle || 'AI课程'}\n\n## 课程概述\n\n本课程聚焦核心知识与实战技能，帮助学员快速掌握相关能力。\n\n### 学习目标\n- 理解核心概念\n- 掌握实战方法\n- 形成行动计划`;
        console.log('[AIPPT] 使用极简 Markdown 内容，长度:', content.length);

        setLoading(false);

        setDebugInfo('调用 AipptIframe.show() - 使用 camelCase 配置强制跳过...');

        // 使用 camelCase 结构 + 顶层参数，这是很多 iframe SDK 的实际有效写法
        instanceRef.current = (window as any).AipptIframe.show({
          appkey: '6705e9d7afd8e',
          channel: 'course-create',
          code: data.code,
          container: containerRef.current,
          editorModel: 1,
          // 顶层直接传递关键参数（SDK 经常这样合并）
          step: 2,
          type: 7,
          customGenerate: {
            content,
            type: 7,
            step: 2,
          },
          options: {
            routerOptions: {
              list: ['generate'],
              generate: { step: 2, type: 7 }
            },
            download_mode: 2,
            skipOutline: true,
            directToTemplate: true,
          },
          onMessage: (type: string, msgData: any) => {
            console.log('[AIPPT] onMessage:', type, msgData);
            setDebugInfo(`收到消息: ${type}`);

            if (type === 'GENERATE_PPT_SUCCESS' || type === 'PPT_DOWNLOAD') {
              const url = msgData?.file?.url || msgData?.url || msgData?.fileUrl || null;
              if (url) setPptUrl(url);
              setCompleted(true);
              setDebugInfo('PPT 生成成功');
            }
            if (type === 'TOKEN_EXPIRE') {
              setError('AIPPT 授权已过期，请刷新页面重试');
            }
          },
        });
        setDebugInfo('AIPPT 编辑器初始化完成');
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : '初始化 AIPPT 失败');
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      try { (window as any).AipptIframe?.close(); } catch { /* noop */ }
    };
  }, [courseTitle]);

  const handleDownload = () => {
    if (!pptUrl) return;
    const a = document.createElement('a');
    a.href = pptUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = `${courseTitle || '课件'}.pptx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-12 h-12 flex items-center justify-center bg-red-50 rounded-full">
            <i className="ri-error-warning-line text-red-500 text-2xl" />
          </div>
          <p className="text-sm text-red-600 text-center max-w-md">{error}</p>
          {debugInfo && <p className="text-xs text-gray-500 text-center">{debugInfo}</p>}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            刷新重试
          </button>
        </div>
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 py-3 flex items-center justify-end">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-[12px] font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line text-sm" />
            返回上一步
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-100 overflow-hidden">
      {loading && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">正在加载 AIPPT 模板选择器…</p>
            {debugInfo && <p className="text-xs text-gray-400 font-mono">{debugInfo}</p>}
            <p className="text-[10px] text-gray-400">当前前端端口: 3003（请确保预览地址正确）</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 min-h-0"
        style={{ display: loading ? 'none' : 'block' }}
      />

      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 py-3 flex items-center gap-3 flex-wrap">
        {completed && pptUrl && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
              <i className="ri-checkbox-circle-fill text-green-500 text-sm" />
              <span className="text-[11px] text-green-700 font-medium whitespace-nowrap">PPT 已生成</span>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-lg cursor-pointer whitespace-nowrap"
            >
              <i className="ri-download-2-line text-sm" />
              下载 PPTX
            </button>
          </div>
        )}

        <div className="flex-1" />

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-[12px] font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="ri-arrow-left-line text-sm" />
          返回上一步
        </button>

        <button
          type="button"
          onClick={() => { if (completed) onNext(); }}
          disabled={!completed}
          className={`flex items-center gap-2 px-8 py-2 text-[13px] font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            completed ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          确认课件，继续下一步
          <i className="ri-arrow-right-line text-sm" />
        </button>
      </div>
    </div>
  );
};

export default CoursewareGenerationEditor;
