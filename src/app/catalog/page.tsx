import { redirect } from "next/navigation";

export default function CatalogRedirect() {
    // The Inspiration Catalog is now fully integrated into the Interactive Map
    redirect("/map");
}
