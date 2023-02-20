export default function sideSearchConfig(elem) {
  let status = false;

  if (
    (elem.keyCode >= 48 && elem.keyCode <= 57) ||
    (elem.keyCode >= 65 && elem.keyCode <= 90) ||
    elem.keyCode == 8
  ) {
    status = true;
  }
  if (elem.keyCode == 27) {
    status = false;
    console.log("getr out");
  }

  return status;
}
