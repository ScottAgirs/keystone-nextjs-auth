import React, { Fragment, useState } from 'react';
import { FieldProps } from '@keystone-next/types';
import { css } from '@emotion/css';
import { Button } from '@keystone-ui/button';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { MinusCircleIcon, LinkIcon } from '@keystone-ui/icons';
import { controller } from '@keystone-next/fields/types/json/views';
import { useSession, signIn } from 'next-auth/client';

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

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => {
  const [labelValue, setLabelValue] = useState('');
  const [hrefValue, setHrefValue] = useState('');
  const [index, setIndex] = useState<number | null>(null);

  const relatedIdentities: RelatedIdentity[] = value ? JSON.parse(value) : [];

  const onSubmitNewRelatedIdentity = () => {
    if (onChange) {
      const relatedIdentitiesCopy = [
        ...relatedIdentities,
        { label: labelValue, href: hrefValue },
      ];
      onChange(JSON.stringify(relatedIdentitiesCopy));
      onCancelRelatedIdentity();
    }
  };

  const onDeleteRelatedIdentity = (index: number) => {
    if (onChange) {
      const relatedIdentitiesCopy = [...relatedIdentities];
      relatedIdentitiesCopy.splice(index, 1);
      onChange(JSON.stringify(relatedIdentitiesCopy));
      onCancelRelatedIdentity();
    }
  };

  const onEditRelatedIdentity = (index: number) => {
    if (onChange) {
      setIndex(index);
      setLabelValue(relatedIdentities[index].label);
      setHrefValue(relatedIdentities[index].href);
    }
  };

  const onUpdateRelatedIdentity = () => {
    if (onChange && index !== null) {
      const relatedIdentitiesCopy = [...relatedIdentities];
      relatedIdentitiesCopy[index] = { label: labelValue, href: hrefValue };
      onChange(JSON.stringify(relatedIdentitiesCopy));
      onCancelRelatedIdentity();
    }
  };

  const onCancelRelatedIdentity = () => {
    setIndex(null);
    setLabelValue('');
    setHrefValue('');
  };

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {onChange && (
        <>
          <div className={styles.form.field}>
            <FieldLabel className={styles.form.label}>Label</FieldLabel>
            <TextInput
              autoFocus={autoFocus}
              onChange={(event) => setLabelValue(event.target.value)}
              value={labelValue}
              className={styles.form.input}
            />
          </div>
          <div className={styles.form.field}>
            <FieldLabel className={styles.form.label}>Href</FieldLabel>
            <TextInput
              autoFocus={autoFocus}
              onChange={(event) => setHrefValue(event.target.value)}
              value={hrefValue}
              className={styles.form.input}
            />
          </div>
          <Button
            onClick={onSubmitNewRelatedIdentity}
            className={styles.form.button}
          >
            Add
          </Button>
        </>
      )}
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
              </div>
              {onChange && (
                <div>
                  <Button
                    onClick={() =>
                      signIn(
                        relatedIdentity.authProvider,
                        { callbackUrl: '/me' },
                        { connection: relatedIdentity.providerConnection }
                      )
                    }
                  >
                    <LinkIcon size="small" color="blue" />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => onEditRelatedIdentity(i)}
                    className={styles.list.optionButton}
                  >
                    <LinkIcon size="small" color="blue" />
                  </Button>
                  <Button size="small" className={styles.list.optionButton}>
                    <MinusCircleIcon
                      size="small"
                      color="red"
                      onClick={() => onDeleteRelatedIdentity(i)}
                    />
                  </Button>
                </div>
              )}
            </li>
          )
        )}
      </ul>
    </FieldContainer>
  );
};
