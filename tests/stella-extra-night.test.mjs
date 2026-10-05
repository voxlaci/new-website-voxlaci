import assert from "node:assert/strict";
import { calculateChoirResidenceTotal } from "../functions/_shared/stella.js";

const total = (rooms) => calculateChoirResidenceTotal(rooms);

assert.deepEqual(total([{ room_type: "twin", guest1: "A", guest2: "B", extra_night_option: "none" }]), {
  guestTotal: 2, baseCents: 49800, extraNightCents: 0, totalCents: 49800,
});
assert.equal(total([{ room_type: "double", guest1: "A", extra_night_option: "with_dinner" }]).totalCents, 34400);
assert.equal(total([{ room_type: "triple", guest1: "A", extra_night_option: "without_dinner" }]).totalCents, 33900);
assert.equal(total([{ room_type: "single", guest1: "A", extra_night_option: "with_dinner" }]).totalCents, 43400);
assert.equal(total([{ room_type: "single", guest1: "A", extra_night_option: "without_dinner" }]).totalCents, 42900);
assert.deepEqual(total([
  { room_type: "twin", guest1: "A", guest2: "B", extra_night_option: "with_dinner" },
  { room_type: "single", guest1: "C", extra_night_option: "without_dinner" },
]), { guestTotal: 3, baseCents: 80700, extraNightCents: 31000, totalCents: 111700 });

console.log("STELLA extra-night pricing tests passed");
