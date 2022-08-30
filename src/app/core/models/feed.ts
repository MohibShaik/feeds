export class Feed {
    constructor(
      public imagePath: string,
      public content: string,
      public userId: string,
    ) {
      this.imagePath = imagePath;
      this.content = content;
      this.userId = userId;
    }
  }