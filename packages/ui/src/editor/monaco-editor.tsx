'use client';

import { type OnMount } from '@monaco-editor/react';
import { Button } from '@shadcn/ui/button';
import { cn } from '@shadcn/ui/lib/utils';
import { useSize } from 'ahooks';
import { EyeIcon, EyeOff, FullscreenIcon, MinimizeIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: (value: string | undefined) => void;
  title?: string;
  description?: string;
  placeholder?: string;
  render?: (value?: string) => React.ReactNode;
  onMount?: OnMount;
  language?: string;
  className?: string;
}

export function MonacoEditor({
  value,
  onChange,
  onBlur,
  title = 'Editor Title',
  description,
  placeholder = 'Start typing...',
  render,
  onMount,
  language = 'markdown',
  className,
}: MonacoEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const togglePreview = () => setIsPreviewVisible(!isPreviewVisible);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (onMount) onMount(editor, monaco);
    editor.onDidBlurEditorWidget(() => {
      if (onBlur) {
        onBlur(editor.getValue());
      }
    });
  };
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  return (
    <div ref={ref} className='size-full'>
      <div style={size}>
        <div
          className={cn('flex size-full min-h-96 flex-col rounded-md border', className, {
            'bg-background fixed inset-0 z-50 !mt-0 h-screen': isFullscreen,
          })}
        >
          <div className='flex items-center justify-between border-b p-2'>
            <div>
              <h1 className='text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                {title}
              </h1>
              <p className='text-muted-foreground text-[0.8rem]'>{description}</p>
            </div>

            <div className='flex items-center space-x-2'>
              {render && (
                <Button variant='outline' size='icon' type='button' onClick={togglePreview}>
                  {isPreviewVisible ? <EyeOff /> : <EyeIcon />}
                </Button>
              )}
              <Button variant='outline' size='icon' type='button' onClick={toggleFullscreen}>
                {isFullscreen ? <MinimizeIcon /> : <FullscreenIcon />}
              </Button>
            </div>
          </div>

          <div className={cn('relative flex flex-1 overflow-hidden')}>
            <div
              className={cn('flex-1 overflow-hidden p-4 invert dark:invert-0', {
                'w-1/2': isPreviewVisible,
              })}
            >
              <Editor
                language={language}
                value={value}
                onChange={onChange}
                onMount={handleEditorDidMount}
                className=''
                options={{
                  automaticLayout: true,
                  contextmenu: false,
                  folding: false,
                  fontSize: 14,
                  formatOnPaste: true,
                  formatOnType: true,
                  glyphMargin: false,
                  lineNumbers: 'off',
                  minimap: { enabled: false },
                  overviewRulerLanes: 0,
                  renderLineHighlight: 'none',
                  scrollBeyondLastLine: false,
                  scrollbar: {
                    useShadows: false,
                    vertical: 'hidden',
                  },
                  tabSize: 2,
                  wordWrap: 'off',
                }}
                theme='transparentTheme'
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme('transparentTheme', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [],
                    colors: {
                      'editor.background': '#00000000',
                    },
                  });
                }}
              />
              {!value && placeholder && (
                <pre
                  className='text-muted-foreground pointer-events-none absolute left-7 top-4 text-sm'
                  style={{ userSelect: 'none' }}
                >
                  {placeholder}
                </pre>
              )}
            </div>
            {render && isPreviewVisible && (
              <div className='w-1/2 flex-1 overflow-auto border-l p-4'>{render(value)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
