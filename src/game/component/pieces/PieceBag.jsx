/** @format */

export default class PieceBag {

    constructor() {

        this.bag = [];

    }


    // ==========================================
    // CREATE BAG
    // ==========================================

    createBag() {

        // Only I and O

        const pieces = [
            "I",
            "O",
            "T",
            "Z",
            "S",
            "J",
            "L",
        ];


        // Shuffle

        for (
            let i = pieces.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );


            [
                pieces[i],
                pieces[j]
            ] = [
                pieces[j],
                pieces[i]
            ];
        }


        return pieces;
    }


    // ==========================================
    // GET NEXT PIECE
    // ==========================================

    next() {

        if (
            this.bag.length === 0
        ) {

            this.bag =
                this.createBag();
        }


        return this.bag.shift();
    }


    // ==========================================
    // PREVIEW NEXT PIECES
    // ==========================================

    peek(count = 1) {

        while (
            this.bag.length < count
        ) {

            this.bag.push(
                ...this.createBag()
            );
        }


        return this.bag.slice(
            0,
            count
        );
    }
}