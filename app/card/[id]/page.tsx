import { Metadata } from "next";
import SharedCardView from "./SharedCardView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `MicMic Card #${id} | Seismic`,
    description: "Check out this Seismic MicMic Card",
    openGraph: {
      title: `MicMic Card #${id} | Seismic`,
      description: "Check out this Seismic MicMic Card",
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  return <SharedCardView cardId={id} />;
}
