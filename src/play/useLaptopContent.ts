import { useAppActions } from '../hooks/useAppActions';
import { useLaptopTools } from '../hooks/useLaptopTools';
import { laptopPresentation } from './laptopPresentation';
import type { LaptopWorkspace } from './useLaptopWorkspace';
export function useLaptopContent(workspace: LaptopWorkspace) {
  const { closeLaptop } = useAppActions();
  const { editorKind } = useLaptopTools();
  return { closeLaptop, ...laptopPresentation(workspace, editorKind) };
}
