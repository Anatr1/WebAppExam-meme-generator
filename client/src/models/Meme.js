/**
 * Object describing a meme
 */
class Meme {
    /**
     * Create a new Meme
     * 
     */
    constructor(id, title, image, sentences, visibility, creator, font, color) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.sentences = sentences;
        this.visibility = visibility;
        this.creator = creator;
        this.font = font;
        this.color = color;
    }

    static from(json) {
        const meme = new Meme();
        Object.assign(meme, json);

        return meme;
    }

}

export default Meme;