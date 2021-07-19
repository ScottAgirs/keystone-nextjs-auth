import React from 'react';
import { FieldProps } from '@keystone-next/types';
import { css } from '@emotion/css';
import { FieldContainer, FieldLabel } from '@keystone-ui/fields';
import { controller } from '@keystone-next/fields/types/json/views';

interface RelatedIdentity {
  name: string;
  email: string;
  subjectId: string;
  id: string;
  authProvider: string;
  providerConnection: string;
  linkStage: 'UNLINKED' | 'APPROVED' | 'LINKED';
}

const styles = {
  form: {
    field: css`
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
      margin: 1rem 0 0 0;
    `,
    label: css`
      width: 10%;
    `,
    input: css`
      width: 90%;
    `,
    button: css`
      margin: 1rem 0.5rem 0 0;
    `,
  },
  list: {
    ul: css`
      list-style: none;
      margin: 1rem 0 0 0;
      padding: 0;
    `,
    li: css`
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;

      &:nth-of-type(2n) > div:nth-of-type(1) {
        background-color: white;
      }
    `,
    data: css`
      background-color: #eff3f6;
      padding: 0.5rem;
      flex: auto;
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    `,
    dataLabel: css`
      width: 40%;
    `,
    dataHref: css`
      width: 60%;
    `,
    optionButton: css`
      margin: 0 0 0 0.5rem;
    `,
  },
};

export const Field = ({ field, value }: FieldProps<typeof controller>) => {
  const relatedIdentities: RelatedIdentity[] = value ? JSON.parse(value) : [];

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <ul className={styles.list.ul}>
        {relatedIdentities.map(
          (relatedIdentity: RelatedIdentity, i: number) => (
            <li key={`related-link-${i}`} className={styles.list.li}>
              <div className={styles.list.data}>
                <div className={styles.list.dataLabel}>
                  {relatedIdentity.name}
                </div>
                <div className={styles.list.dataLabel}>
                  {relatedIdentity.email}
                </div>
                <div className={styles.list.dataLabel}>
                  {relatedIdentity.subjectId}
                </div>
                <div className={styles.list.dataLabel}>
                  {relatedIdentity.authProvider}
                </div>
                <div className={styles.list.dataLabel}>
                  {relatedIdentity.linkStage}
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </FieldContainer>
  );
};
