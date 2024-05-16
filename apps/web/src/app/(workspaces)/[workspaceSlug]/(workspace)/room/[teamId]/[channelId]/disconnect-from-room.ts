import { jotaiStore } from "@/components/providers";
import {
  callQualityAtom,
  camStatusAtom,
  isCarouselOpenAtom,
  isFullScreenAtom,
  isSpeakingAtom,
  roomAtom,
  screenStatusAtom,
} from "./atoms";
import { toast } from "sonner";

export const disconnectFromRoom = async () => {
  try {
    const room = jotaiStore.get(roomAtom);

    await room?.room.disconnect();
    jotaiStore.set(roomAtom, undefined);
    jotaiStore.set(camStatusAtom, false);
    jotaiStore.set(screenStatusAtom, false);
    jotaiStore.set(callQualityAtom, "");
    jotaiStore.set(isSpeakingAtom, false);
    jotaiStore.set(isCarouselOpenAtom, true);
    jotaiStore.set(isFullScreenAtom, false);

    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  } catch (e) {
    toast.error("Failed to disconnect from room");
  }
};
