import { useParams } from "react-router-dom";
import { GoabText, GoabPageBlock } from "@abgov/react-components";

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <GoabPageBlock width="full">
      <GoabText tag="h1" size="heading-xl" mt="none" mb="l">
        Case Detail {id} (To be continued)
      </GoabText>
    </GoabPageBlock>
  );
}
