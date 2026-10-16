import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../content/localization';
import { officeDestination, officeMotionFacing, officeMotionRear, officeRoute, type OfficeActivity, type OfficePoint } from './officeMovement';
export function useOfficeColleague(index: number, activity: OfficeActivity, beat: number, introducing: boolean) {
    const reduced = useReducedMotion();
    const destination = officeDestination(index, activity, beat);
    const previous = useRef<OfficePoint>(destination);
    const position = useRef<OfficePoint>(destination);
    const direction = useRef<'left' | 'right'>('right');
    const [facing, setFacing] = useState<'left' | 'right'>('right');
    const [walking, setWalking] = useState(false);
    const rearDirection = useRef(false);
    const [rear, setRear] = useState(false);
    const route = useMemo(() => officeRoute(previous.current, destination), [destination[0], destination[1]]);
    const moving = route.length > 1;
    useEffect(() => { previous.current = destination; }, [destination[0], destination[1]]);
    const { t } = useI18n();
    const Tag = introducing ? 'span' as const : 'button' as const;
    const atDesk = activity === 'work' && !(beat % 4 === 1 && index === Math.floor(beat / 4) % 5);
    const onUpdate = (latest: Record<string, string | number>) => { const point: OfficePoint = [parseFloat(String(latest.left)), parseFloat(String(latest.top))]; if (!Number.isFinite(point[0]) || !Number.isFinite(point[1]))
        return; const next = officeMotionFacing(position.current, point, direction.current); const nextRear = officeMotionRear(position.current, point, rearDirection.current); position.current = point; if (nextRear !== rearDirection.current) {
        rearDirection.current = nextRear;
        setRear(nextRear);
    } if (next !== direction.current) {
        direction.current = next;
        setFacing(next);
    } };
    const onAnimationStart = () => setWalking(moving && !reduced);
    const onAnimationComplete = () => setWalking(false);
    return { onUpdate, onAnimationStart, onAnimationComplete, reduced, destination, position, direction, facing, setFacing, walking, setWalking, rearDirection, rear, setRear, route, moving, t, Tag, atDesk };
}
