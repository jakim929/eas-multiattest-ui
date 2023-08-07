import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { forwardRef, useCallback, useMemo } from "react";
import { Address, Hex, isAddress, isHex } from "viem";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Switch } from "@/components/ui/switch";

// This whole file is a typescript abomination, fix later
// dynamic forms based on string schema is hard

const x: Record<string, z.ZodTypeAny> = {
  address: z.string().refine(isAddress, {
    message: "Invalid address",
  }),
  string: z.string(),
  bool: z.boolean(),
  bytes32: z.string().refine(isHex, {
    message: "Invalid bytes32 value",
  }),
  bytes: z.string().refine(isHex, {
    message: "Invalid bytes value",
  }),
  uint: z.preprocess((a) => parseInt(a as string, 10), z.number()),
};

const addressListSchema = z
  .string()
  .refine(
    (val) => {
      const addresses = val.split(",");
      return addresses.length > 0 && addresses.every(isAddress);
    },
    {
      message: "Invalid comma separated addresses",
    },
  )
  .transform((val) => val.split(",") as Address[]);

// Fix type => prob easiest to make this a component
const y: Record<string, React.FC> = {
  address: Input,
  string: Input,
  bool: forwardRef(({ value, onChange, ...props }) => (
    <Switch
      className="flex"
      checked={value}
      onCheckedChange={onChange}
      {...props}
    />
  )),
  bytes32: Input,
  bytes: Input,
  uint: forwardRef((props) => <Input type="number" {...props} />),
};

const getValidator = (types: { type: string; name: string }[]) => {
  const current = types.reduce(
    (schema, { name, type }) =>
      schema.setKey(name, x[type.startsWith("uint") ? "uint" : type]),
    z.object({}),
  );
  return current.setKey("recipients", addressListSchema);
};

export const SchemaDataInput = ({
  schema,
  onSubmit,
}: {
  schema: string;
  onSubmit: (data: Hex, addresses: Address[]) => void;
}) => {
  const { schemaEncoder, validator } = useMemo(() => {
    const _schemaEncoder = new SchemaEncoder(schema);
    const validator = getValidator(_schemaEncoder.schema);
    return { schemaEncoder: _schemaEncoder, validator };
  }, [schema]);

  const form = useForm({
    resolver: zodResolver(validator),
    mode: "onTouched",
  });

  const onSubmitForm = useCallback(
    (values: Record<string, any>) => {
      const result = schemaEncoder.schema.map(({ name, type }) => {
        return {
          name,
          value: values[name],
          type,
        };
      });
      const encodedData = schemaEncoder.encodeData(result);
      console.log("test", encodedData);
      onSubmit(encodedData as Hex, values.recipients);
    },
    [schemaEncoder, onSubmit],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
        <FormField
          key="recipients"
          control={form.control}
          name="recipients"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Attestation recipients</FormLabel>
                <FormControl>
                  <Input placeholder="Attestation recipients" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {schemaEncoder.schema.map(({ name, type }) => {
          const InputComponent = y[type.startsWith("uint") ? "uint" : type];
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      {type} {name}
                    </FormLabel>
                    <FormControl>
                      <InputComponent placeholder={name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
