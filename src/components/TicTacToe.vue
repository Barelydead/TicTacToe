<template>
    <div class="mb-4">
        <h1 class="text-3xl text-black">Tic Tac Toe</h1>
        <p>Challange a foe!</p>
        <div v-if="yourMarker" class="mt-4">
            <p>You are playing with marker: {{ yourMarker }}</p>
        </div>
    </div>
    <div class="grid grid-cols-3 auto-rows-max">
        <div v-for="(square, i) in board" :key="i" class="border border-solid bolder-black text-5xl aspect-w-1 aspect-h-1 hover:bg-gray-200">
            <div @click="placeMarker(i)" class="flex justify-center items-center">{{ square ? square : '' }}</div>
        </div>
    </div>
    <div v-if="winner">
        <p>{{this.marker}} is the winner!</p>
    </div>
    <div v-if="draw">
        <p>This game was a draw</p>
    </div>
    <div>
        <button @click="resetBoard">Reset the board</button>
    </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io('http://localhost:1337');

export default  {
    created() {
        socket.emit('new-player')
        this.getRealtimeData()
    },
    unmounted() {
        socket.emit('disconnect')
    },
    data() {
        return {
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            marker: 'X',
            winner: false,
            draw: false,
            yourMarker: false,
        }
    },
    methods: {
        placeMarker(index) {
            if (this.marker !== this.yourMarker) {
                return;
            }

            if (this.winner) {
                return;
            }

            if (this.board[index] !== 0) {
                return;
            }

            this.board[index] = this.marker;
            this.checkWinner();

            if (!this.winner) this.marker = this.marker == 'X' ? 'O' : 'X';

            socket.emit('sync-game', this.$data)
        },
        checkWinner() {
            // Check the rows
            if (this.board[0] === this.marker && this.board[1] === this.marker && this.board[2] === this.marker
                || this.board[3] === this.marker && this.board[4] === this.marker && this.board[5] === this.marker
                || this.board[6] === this.marker && this.board[7] === this.marker && this.board[8] === this.marker) {
                    this.winner = true;
                    return;
                }

            // Check cols
            if (this.board[0] === this.marker && this.board[3] === this.marker && this.board[6] === this.marker
                || this.board[1] === this.marker && this.board[4] === this.marker && this.board[7] === this.marker
                || this.board[2] === this.marker && this.board[5] === this.marker && this.board[8] === this.marker) {
                    this.winner = true;
                    return;
                }

            // Check diagonals
            if (this.board[0] === this.marker && this.board[4] === this.marker && this.board[8] === this.marker
                || this.board[2] === this.marker && this.board[4] === this.marker && this.board[6] === this.marker) {
                    this.winner = true;
                    return;
                }

            if (!this.board.includes(0)) {
                this.draw = true;
                return;
            }
        },
        resetBoard() {
            this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.winner = false;
            this.draw = false;
            this.marker = 'X';
            this.players = 0;

            socket.emit('sync-game', this.$data)
        },
        getRealtimeData() {
            // Sync the game state.
            socket.on('sync-game', function(data) {
                this.board = data.board;
                this.winner = data.winner;
                this.draw = data.draw;
                this.marker = data.marker;
                this.players = data.players;
            }.bind(this))

            socket.on('new-player', function(data) {
                this.yourMarker = data.marker
            }.bind(this))
        },
    }
}
</script>

<style>

</style>