// The lightbox slot at rest. A full page load never opens the lightbox — it
// renders the photograph's own page instead — so on any URL that is not an
// intercepted photograph this slot is empty.
export default function LightboxDefault() {
  return null;
}
