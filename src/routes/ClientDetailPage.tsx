import React from "react";
import { useParams } from "react-router-dom";
import {
  GoabText,
  GoabPageBlock,
} from "@abgov/react-components";

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <GoabPageBlock width="full">
      <GoabText tag="h1" size="heading-xl" mt="none" mb="l">
        Client Detail {id} (To be continue)
      </GoabText>
    </GoabPageBlock>
  );
}
