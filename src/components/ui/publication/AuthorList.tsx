import type { FC } from 'react';
import { memo } from 'react';
import { renderAuthorsBold } from './utils';

interface AuthorListProps {
  readonly authors: string;
}

const AuthorListComponent: FC<AuthorListProps> = ({ authors }) => {
  const authorData = renderAuthorsBold(authors);

  return (
    <>
      {authorData.map((author, idx) => (
        <span key={`${author.name}-${idx}`}>
          {author.isOwner ? <strong>{author.name}</strong> : author.name}
          {!author.isLast ? ', ' : ''}
        </span>
      ))}
    </>
  );
};

// Memoize the component
export const AuthorList = memo(AuthorListComponent, (prevProps, nextProps) => {
  return prevProps.authors === nextProps.authors;
});

AuthorList.displayName = 'AuthorList';
export default AuthorList;
