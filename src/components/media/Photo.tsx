// src/components/media/Photo.tsx
// A photograph with its blur placeholder looked up from the generated
// blur.ts. Every photo on the site goes through here or through PhotoView.
//
// This file imports the whole blur map, so it belongs to Server Components.
// A Client Component renders `PhotoView` and receives `blur` from the server
// (src/lib/__tests__/client-boundary.test.ts keeps it that way).
import { blurMap } from '@/data/blur';
import { PhotoView, type PhotoViewProps } from './PhotoView';

export type PhotoProps = Omit<PhotoViewProps, 'blur'>;

export function Photo(props: PhotoProps) {
  return <PhotoView {...props} blur={blurMap[props.photo.src]} />;
}
