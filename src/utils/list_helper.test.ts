import type { BlogType } from "../models/blogs";

const duummy = (_blogs: BlogType[]) => {
  return 1;
};

test("dummy returns one", () => {
  const blogs: BlogType[] = [];

  const result = duummy(blogs);
  expect(result).toBe(1);
});
