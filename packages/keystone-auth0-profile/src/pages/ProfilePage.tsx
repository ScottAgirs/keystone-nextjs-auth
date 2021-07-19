/* @jsx jsx */

import copyToClipboard from 'clipboard-copy';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Fragment,
  HTMLAttributes,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ListMeta } from '@keystone-next/types';
import { Button } from '@keystone-ui/button';
import {
  Box,
  Center,
  Heading,
  Stack,
  Text,
  jsx,
  useTheme,
} from '@keystone-ui/core';
import { LoadingDots } from '@keystone-ui/loading';
import { ClipboardIcon } from '@keystone-ui/icons/icons/ClipboardIcon';
import { ChevronRightIcon } from '@keystone-ui/icons/icons/ChevronRightIcon';
import { AlertDialog, DrawerController } from '@keystone-ui/modals';
import { Notice } from '@keystone-ui/notice';
import { useToasts } from '@keystone-ui/toast';
import { Tooltip } from '@keystone-ui/tooltip';
import { FieldLabel, TextInput } from '@keystone-ui/fields';
import {
  DataGetter,
  DeepNullable,
  makeDataGetter,
  deserializeValue,
  ItemData,
  useInvalidFields,
  Fields,
  useChangedFieldsAndDataForUpdate,
} from '@keystone-next/admin-ui-utils';

import {
  gql,
  useMutation,
  useQuery,
} from '@keystone-next/keystone/admin-ui/apollo';
import { useList } from '@keystone-next/keystone/admin-ui/context';
import {
  PageContainer,
  GraphQLErrorNotice,
  CreateItemDrawer,
} from '@keystone-next/keystone/admin-ui/components';

import { useSession, signIn } from 'next-auth/client';

type ItemPageProps = {
  listKey: string;
};

function useEventCallback<Func extends (...args: any) => any>(
  callback: Func
): Func {
  const callbackRef = useRef(callback);
  const cb = useCallback((...args) => callbackRef.current(...args), []);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return cb as any;
}

function ItemForm({
  listKey,
  itemGetter,
  selectedFields,
  fieldModes,
}: {
  listKey: string;
  itemGetter: DataGetter<ItemData>;
  selectedFields: string;
  fieldModes: Record<string, 'edit' | 'read' | 'hidden'>;
}) {
  const list = useList(listKey);

  const [update, { loading, error, data }] = useMutation(
    gql`mutation ($data: ${list.gqlNames.updateInputName}!, $id: ID!) {
      item: ${list.gqlNames.updateMutationName}(id: $id, data: $data) {
        ${selectedFields}
      }
    }`,
    {
      errorPolicy: 'all',
    }
  );
  itemGetter =
    useMemo(() => {
      if (data) {
        return makeDataGetter(data, error?.graphQLErrors).get('item');
      }
    }, [data, error]) ?? itemGetter;

  const [state, setValue] = useState(() => {
    const value = deserializeValue(list.fields, itemGetter);
    return {
      value,
      item: itemGetter.data,
    };
  });
  if (
    !loading &&
    state.item !== itemGetter.data &&
    (itemGetter.errors || []).every((x) => x.path?.length !== 1)
  ) {
    const value = deserializeValue(list.fields, itemGetter);
    setValue({
      value,
      item: itemGetter.data,
    });
  }

  const { changedFields, dataForUpdate } = useChangedFieldsAndDataForUpdate(
    list.fields,
    itemGetter,
    state.value
  );

  const invalidFields = useInvalidFields(list.fields, state.value);

  const [forceValidation, setForceValidation] = useState(false);
  const toasts = useToasts();
  const onSave = useEventCallback(() => {
    const newForceValidation = invalidFields.size !== 0;
    setForceValidation(newForceValidation);
    if (newForceValidation) return;

    update({
      variables: {
        data: dataForUpdate,
        id: itemGetter.get('id').data,
      },
    })
      // TODO -- Experimenting with less detail in the toasts, so the data lines are commented
      // out below. If we're happy with this, clean up the unused lines.
      .then(({ /* data, */ errors }) => {
        // we're checking for path.length === 1 because errors with a path larger than 1 will
        // be field level errors which are handled seperately and do not indicate a failure to
        // update the item
        const error = errors?.find((x) => x.path?.length === 1);
        if (error) {
          toasts.addToast({
            title: 'Failed to update item',
            tone: 'negative',
            message: error.message,
          });
        } else {
          toasts.addToast({
            // title: data.item[list.labelField] || data.item.id,
            tone: 'positive',
            title: 'Saved successfully',
            // message: 'Saved successfully',
          });
        }
      })
      .catch((err) => {
        toasts.addToast({
          title: 'Failed to update item',
          tone: 'negative',
          message: err.message,
        });
      });
  });
  return (
    <Box marginTop="xlarge">
      <GraphQLErrorNotice
        networkError={error?.networkError}
        // we're checking for path.length === 1 because errors with a path larger than 1 will be field level errors
        // which are handled seperately and do not indicate a failure to update the item
        errors={error?.graphQLErrors.filter((x) => x.path?.length === 1)}
      />
      <Fields
        fieldModes={fieldModes}
        fields={list.fields}
        forceValidation={forceValidation}
        invalidFields={invalidFields}
        onChange={useCallback(
          (value) => {
            setValue((state) => ({
              item: state.item,
              value: value(state.value),
            }));
          },
          [setValue]
        )}
        value={state.value}
      />
      <Toolbar
        onSave={onSave}
        hasChangedFields={!!changedFields.size}
        onReset={useEventCallback(() => {
          setValue({
            item: itemGetter.data,
            value: deserializeValue(list.fields, itemGetter),
          });
        })}
        loading={loading}
      />
    </Box>
  );
}

export const getProfilePage = (props: ItemPageProps) => () =>
  <ItemPage {...props} />;

const ItemPage = ({ listKey }: ItemPageProps) => {
  const [session, sessionLoading] = useSession();

  console.log(session);

  const list = useList(listKey);
  const { palette, spacing, typography } = useTheme();

  // Remove identities from the field list so we can render our own...
  delete list.fields.identities;

  const { query, selectedFields } = useMemo(() => {
    const selectedFields = Object.keys(list.fields)
      .map((fieldPath) => list.fields[fieldPath].controller.graphqlSelection)
      .join('\n');
    return {
      selectedFields,
      query: gql`
        query ItemPage($id: ID!, $listKey: String!) {
          item: ${list.gqlNames.itemQueryName}(where: {id: $id}) {
            ${selectedFields}
          }
          keystone {
            adminMeta {
              list(key: $listKey) {
                hideCreate
                hideDelete
                fields {
                  path
                  itemView(id: $id) {
                    fieldMode
                  }
                }
              }
            }
          }
        }
      `,
    };
  }, [list]);
  const id = sessionLoading ? null : session.itemId;
  let { data, error, loading } = useQuery(query, {
    variables: { id, listKey },
    errorPolicy: 'all',
    skip: sessionLoading,
  });
  loading ||= sessionLoading;

  const dataGetter = makeDataGetter<
    DeepNullable<{
      item: ItemData;
      keystone: {
        adminMeta: {
          list: {
            fields: {
              path: string;
              itemView: {
                fieldMode: 'edit' | 'read' | 'hidden';
              };
            }[];
          };
        };
      };
    }>
  >(data, error?.graphQLErrors);

  const itemViewFieldModesByField = useMemo(() => {
    const itemViewFieldModesByField: Record<
      string,
      'edit' | 'read' | 'hidden'
    > = {};
    dataGetter.data?.keystone?.adminMeta?.list?.fields?.forEach((field) => {
      if (
        field !== null &&
        field.path !== null &&
        field?.itemView?.fieldMode != null
      ) {
        itemViewFieldModesByField[field.path] = field.itemView.fieldMode;
      }
    });
    return itemViewFieldModesByField;
  }, [dataGetter.data?.keystone?.adminMeta?.list?.fields]);

  const metaQueryErrors = dataGetter.get('keystone').errors;

  if (sessionLoading) return <p>Loading...</p>;
  return (
    <PageContainer
      header={
        <div
          css={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <div
            css={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              minWidth: 0,
            }}
          >
            <Heading
              as="h1"
              type="h3"
              css={{
                minWidth: 0,
                maxWidth: '100%',
                overflow: 'hidden',
                flex: 1,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
              }}
            >
              {loading
                ? 'Loading...'
                : (data &&
                  data.item &&
                  (data.item[list.labelField] || data.item.id)) ||
                id}
              &apos;s Profile
            </Heading>
          </div>
        </div>
      }
    >
      {loading ? (
        <Center css={{ height: `calc(100vh - 100px)` }}>
          <LoadingDots label="Loading item data" size="large" tone="passive" />
        </Center>
      ) : metaQueryErrors ? (
        <Box marginY="xlarge">
          <Notice tone="negative">{metaQueryErrors[0].message}</Notice>
        </Box>
      ) : (
        <>
          <ColumnLayout>
            <ItemForm
              fieldModes={itemViewFieldModesByField}
              selectedFields={selectedFields}
              showDelete={!data.keystone.adminMeta.list!.hideDelete}
              listKey={listKey}
              itemGetter={dataGetter.get('item') as DataGetter<ItemData>}
            />
          </ColumnLayout>
        </>
      )}
    </PageContainer>
  );
};

// Styled Components
// ------------------------------

const Toolbar = memo(function Toolbar({
  hasChangedFields,
  loading,
  onSave,
  onReset,
  deleteButton,
}: {
  hasChangedFields: boolean;
  loading: boolean;
  onSave: () => void;
  onReset: () => void;
  deleteButton?: ReactElement;
}) {
  const { colors, spacing } = useTheme();
  return (
    <div
      css={{
        background: colors.background,
        borderTop: `1px solid ${colors.border}`,
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: spacing.xlarge,
        paddingBottom: spacing.xlarge,
        paddingTop: spacing.xlarge,
        position: 'sticky',
        zIndex: 10,
      }}
    >
      <Stack align="center" across gap="small">
        <Button
          isDisabled={!hasChangedFields}
          isLoading={loading}
          weight="bold"
          tone="active"
          onClick={onSave}
        >
          Save changes
        </Button>
        {hasChangedFields ? (
          <Button weight="none" onClick={onReset}>
            Reset changes
          </Button>
        ) : (
          <Text weight="medium" paddingX="large" color="neutral600">
            No changes
          </Text>
        )}
      </Stack>
      {deleteButton}
    </div>
  );
});

const ColumnLayout = (props: HTMLAttributes<HTMLDivElement>) => {
  const { spacing } = useTheme();

  return (
    // this container must be relative to catch absolute children
    // particularly the "expanded" document-field, which needs a height of 100%
    <div css={{ position: 'relative', height: '100%' }}>
      <div
        css={{
          alignItems: 'start',
          display: 'grid',
          gap: spacing.xlarge,
          gridTemplateColumns: `2fr 1fr`,
        }}
        {...props}
      />
    </div>
  );
};
