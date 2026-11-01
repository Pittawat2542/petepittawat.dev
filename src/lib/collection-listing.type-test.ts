import type { Project, Publication, Talk } from './content';
import type { CollectionListingInput } from './collection-listing';
import { collectionMetadata } from './collection-listing';

// Checked by tsc; never called at runtime.
export function verifyCollectionContracts(project: Project, publication: Publication, talk: Talk) {
  const valid: CollectionListingInput[] = [
    { kind: 'projects', items: [project] },
    { kind: 'publications', items: [publication] },
    { kind: 'talks', items: [talk] },
  ];
  collectionMetadata({ kind: 'projects', item: project });
  collectionMetadata({ kind: 'publications', item: publication });
  collectionMetadata({ kind: 'talks', item: talk });
  // @ts-expect-error Publications cannot be passed as projects.
  valid.push({ kind: 'projects', items: [publication] });
  // @ts-expect-error Talk metadata requires a talk item.
  collectionMetadata({ kind: 'talks', item: project });
  // @ts-expect-error Project metadata cannot use publication fields.
  collectionMetadata({ kind: 'projects', item: publication });
  return valid;
}
