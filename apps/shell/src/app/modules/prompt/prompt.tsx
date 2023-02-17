import { useEffect, useRef, useState } from 'react';
import type { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Debounce } from '@cased/utilities';
import {
  useStoreActions,
  useStoreState,
  WebSocketStatus,
  factory,
} from '@cased/redux';
import { useSearchParams } from 'react-router-dom';
import { startLoadingMessage } from './prompt.loader';
import './xterm.scss';
import PromptSearch from './search/prompt-search';
import PromptDownload from './prompt-download';
import PromptShare from './prompt-share';

let terminalMounted = false;

interface IProps {
  slug: string;
}

export default function Prompt({ slug }: IProps) {
  const [searchParams] = useSearchParams();
  const termEl = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal>();
  const terminalFitAddonRef = useRef<FitAddon>();
  const token = useStoreState((state) => state.auth.accessToken);
  const webSocketStatus = useStoreState((state) => state.prompt.status);
  const webSocketConnect = useStoreActions((actions) => actions.prompt.connect);
  const promptForm = useStoreState((state) => state.promptForm.promptForm);
  // @TODO Move to the redux layer so the sockets can be driven by store state, currently there is mixed state handling between component and redux. Component state should be a UI display state only
  // This effect is responsible for initializing the terminal and connecting to the web socket
  useEffect(() => {
    if (!termEl.current) throw new Error('Terminal element not initialized');
    if (!token) throw new Error('Authentication required');
    const term = factory.createTerminal();
    if (!terminalMounted) {
      terminalFitAddonRef.current = new FitAddon();
      setTerminal(term);
      term.loadAddon(terminalFitAddonRef.current);
      term.open(termEl.current);
      terminalFitAddonRef.current.fit();
      terminalMounted = true;
    }

    const approvalStatus = searchParams.get('status') || '';
    webSocketConnect({
      slug,
      token,
      term,
      approvalStatus,
      ...promptForm,
    });
  }, [token, slug, searchParams, promptForm, webSocketConnect]);

  // @TODO Redux layer should bind this logic when the web socket is connected
  // This effect is responsible for updating the terminal when the web socket status changes
  useEffect(() => {
    if (!terminal) return undefined;

    let disposeLoader = () => {};
    if (webSocketStatus === WebSocketStatus.Disconnected) {
      terminal.write('\r\nDisconnected from server\n\r');
      terminal?.dispose();
      setTerminal(undefined);
    } else if (webSocketStatus === WebSocketStatus.Connecting) {
      disposeLoader = startLoadingMessage(terminal, `Connecting to ${slug}`);
    }

    return () => disposeLoader();
  }, [webSocketStatus, slug, terminal]);

  // This effect is responsible for resizing the terminal when the window is resized
  useEffect(() => {
    if (!terminalFitAddonRef.current) return undefined;

    const debouncer = new Debounce(100);
    const handleResize = () => {
      // istanbul ignore next
      debouncer.run(() => terminalFitAddonRef.current?.fit());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-full">
      <span data-testid="prompt-terminal" />
      <div className="absolute right-8 top-2 z-10 flex gap-6 bg-[rgba(0,0,0,0.5)]">
        {terminal ? <PromptSearch terminal={terminal} /> : null}
        <PromptDownload promptSlug={slug} />
        <PromptShare />
      </div>
      <div className="xterm h-full bg-black p-1" ref={termEl} />
    </div>
  );
}
