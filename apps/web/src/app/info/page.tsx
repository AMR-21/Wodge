import { redirect } from "next/navigation";

function InfoPage() {
  return redirect(
    "https://drive.google.com/drive/folders/1rx8KS7pbf7xxM20UzYr_vGIJTCWKmJkh?usp=sharing",
  );
}

export default InfoPage;
