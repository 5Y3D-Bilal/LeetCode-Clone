import { Problem } from "../types/problem";
import { jumpGame } from "./jump-game";
import { reverseLinkedList } from "./reverse-linked-list";
import { search2DMatrix } from "./search-a-2d-matrix";
import { twoSum } from "./tow-sum";
import { validParentheses } from "./valid-prantheses";

interface ProblemMap {
  [key: string]: Problem;
}

export const problems: ProblemMap = {
  "tow-sum": twoSum,
  "reverse-linked-list": reverseLinkedList,
  "jump-game": jumpGame,
  "search-a-2d-matrix": search2DMatrix,
  "valid-praentheses": validParentheses,
};
