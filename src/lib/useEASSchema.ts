import { Hex } from "viem";
import { gql, useQuery } from "urql";

const SchemaQuery = gql`
  query Schema($where: SchemaWhereUniqueInput!) {
    schema(where: $where) {
      id
      schema
      creator
      resolver
      revocable
      index
      txid
      time
    }
  }
`;

export const useEASSchema = ({
  schemaId,
  enabled = true,
}: {
  schemaId?: Hex;
  enabled?: boolean;
}) => {
  const [result, reexecuteQuery] = useQuery({
    query: SchemaQuery,
    variables: {
      where: {
        id: schemaId,
      },
    },
    pause: schemaId && !enabled,
  });

  const { data, fetching } = result;
  return {
    isLoading: fetching,
    schema: data && data.schema ? data.schema.schema : undefined,
  };
};
