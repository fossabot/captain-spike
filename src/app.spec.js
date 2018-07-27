import main from "./app";

describe('app.js', () => {
  
  describe('main', () => {
    it('should throw error if GIT_FOLDER is not defined', () => {
      expect(main).toThrow();
    });
  });
});
