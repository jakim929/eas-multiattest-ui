import { SchemaDataInput } from "@/components/SchemaDataInput";
import { Input } from "@/components/ui/input";
import { EASAbi } from "@/lib/EASAbi";
import { useEASSchema } from "@/lib/useEASSchema";
import { useState } from "react";
import { isHex, Hex, Address } from "viem";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import {
  mainnet,
  optimism,
  arbitrum,
  sepolia,
  optimismGoerli,
  baseGoerli,
} from "wagmi/chains";

const EAS_ADDRESSES: Record<number, Address> = {
  [mainnet.id]: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
  [optimism.id]: "0x4200000000000000000000000000000000000021",
  [arbitrum.id]: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
  [sepolia.id]: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
  [optimismGoerli.id]: "0x4200000000000000000000000000000000000021",
  [baseGoerli.id]: "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A",
};

export const SchemaDetails = () => {
  const [schemaId, setSchemaId] = useState<Hex>();

  const { schema, isLoading: isSchemaLoading } = useEASSchema({
    schemaId,
    enabled: true,
  });

  const { chain } = useNetwork();

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: EAS_ADDRESSES[chain?.id || 1],
    abi: EASAbi,
    functionName: "multiAttest",
    value: 0n,
  });

  console.log(schema);
  if (isSchemaLoading) return <p>Loading...</p>;

  return (
    <div>
      <Input
        placeholder="Schema ID"
        value={schemaId || ""}
        onChange={(e) => {
          console.log(e.target.value);
          if (isHex(e.target.value)) {
            setSchemaId(e.target.value);
          } else {
            setSchemaId(undefined);
          }
        }}
      />
      {schema && (
        <SchemaDataInput
          schema={schema}
          onSubmit={async (data: Hex, recipients: Address[]) => {
            const multiAttestRequest = recipients.map((recipient) => {
              return {
                recipient,
                revocable: true,
                expirationTime: 0n,
                refUID:
                  "0x0000000000000000000000000000000000000000000000000000000000000000" as Hex,
                data,
                value: 0n,
              };
            });
            const result = await writeAsync({
              args: [
                [
                  {
                    schema: schemaId!,
                    data: multiAttestRequest,
                  },
                ],
              ],
            });
            console.log(result);
          }}
        />
      )}
    </div>
  );
};
