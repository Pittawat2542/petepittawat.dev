import type { FC } from 'react';
import { memo } from 'react';

interface FormattedDateProps {
  readonly date: Date;
}

const FormattedDateComponent: FC<FormattedDateProps> = ({ date }) => {
  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </time>
  );
};

export const FormattedDate = memo(FormattedDateComponent);
FormattedDate.displayName = 'FormattedDate';
export default FormattedDate;
