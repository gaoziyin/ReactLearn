// Refs and DOM Examples
// React 19 with TypeScript

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// ===========================================
// Example 1: Basic useRef for DOM Access
// ===========================================
export function FocusInput(): React.ReactElement {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = (): void => {
        inputRef.current?.focus();
    };

    return (
        <div>
            <input ref={inputRef} placeholder="Click button to focus" />
            <button onClick={handleFocus}>Focus Input</button>
        </div>
    );
}

// ===========================================
// Example 2: useRef for Values (Not Re-render)
// ===========================================
export function Timer(): React.ReactElement {
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = (): void => {
        if (intervalRef.current) return; // Already running

        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = (): void => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetTimer = (): void => {
        stopTimer();
        setSeconds(0);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="timer">
            <span>{seconds}s</span>
            <button onClick={startTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
            <button onClick={resetTimer}>Reset</button>
        </div>
    );
}

// ===========================================
// Example 3: Scroll to Element
// ===========================================
export function ScrollToSection(): React.ReactElement {
    const section1Ref = useRef<HTMLDivElement>(null);
    const section2Ref = useRef<HTMLDivElement>(null);
    const section3Ref = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>): void => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="scroll-container">
            <nav className="sticky-nav">
                <button onClick={() => scrollTo(section1Ref)}>Section 1</button>
                <button onClick={() => scrollTo(section2Ref)}>Section 2</button>
                <button onClick={() => scrollTo(section3Ref)}>Section 3</button>
            </nav>

            <div ref={section1Ref} className="section">Section 1 Content</div>
            <div ref={section2Ref} className="section">Section 2 Content</div>
            <div ref={section3Ref} className="section">Section 3 Content</div>
        </div>
    );
}

// ===========================================
// Example 4: Measuring DOM Elements
// ===========================================
export function MeasureElement(): React.ReactElement {
    const boxRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (boxRef.current) {
            const { width, height } = boxRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);

    return (
        <div>
            <div
                ref={boxRef}
                className="measured-box"
                style={{ padding: '20px', background: '#f0f0f0' }}
            >
                This box is being measured
            </div>
            <p>
                Dimensions: {dimensions.width.toFixed(0)}px × {dimensions.height.toFixed(0)}px
            </p>
        </div>
    );
}

// ===========================================
// Example 5: forwardRef (React 19 simplified)
// ===========================================
// In React 19, ref is a regular prop - no forwardRef needed!

interface CustomInputProps {
    label: string;
    ref?: React.Ref<HTMLInputElement>;
}

// React 19 way - ref as prop
export function CustomInput({ label, ref }: CustomInputProps): React.ReactElement {
    return (
        <label className="custom-input">
            <span>{label}</span>
            <input ref={ref} />
        </label>
    );
}

// Using the custom input
export function CustomInputDemo(): React.ReactElement {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = (): void => {
        inputRef.current?.focus();
    };

    return (
        <div>
            <CustomInput label="Name" ref={inputRef} />
            <button onClick={focusInput}>Focus</button>
        </div>
    );
}

// ===========================================
// Example 6: useImperativeHandle
// ===========================================
interface VideoPlayerHandle {
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
}

interface VideoPlayerProps {
    src: string;
    ref?: React.Ref<VideoPlayerHandle>;
}

export function VideoPlayer({ src, ref }: VideoPlayerProps): React.ReactElement {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => ({
        play: () => videoRef.current?.play(),
        pause: () => videoRef.current?.pause(),
        seek: (time: number) => {
            if (videoRef.current) {
                videoRef.current.currentTime = time;
            }
        },
    }), []);

    return (
        <video ref={videoRef} src={src} className="video-player" />
    );
}

// Using VideoPlayer
export function VideoPlayerDemo(): React.ReactElement {
    const playerRef = useRef<VideoPlayerHandle>(null);

    return (
        <div>
            <VideoPlayer ref={playerRef} src="/sample-video.mp4" />
            <div className="controls">
                <button onClick={() => playerRef.current?.play()}>Play</button>
                <button onClick={() => playerRef.current?.pause()}>Pause</button>
                <button onClick={() => playerRef.current?.seek(0)}>Restart</button>
            </div>
        </div>
    );
}

// ===========================================
// Example 7: Previous Value with useRef
// ===========================================
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export function PreviousValueDemo(): React.ReactElement {
    const [count, setCount] = useState(0);
    const previousCount = usePrevious(count);

    return (
        <div>
            <p>Current: {count}</p>
            <p>Previous: {previousCount ?? 'N/A'}</p>
            <button onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
    );
}
