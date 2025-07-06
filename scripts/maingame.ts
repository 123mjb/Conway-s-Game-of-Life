
var grid: ConwayGrid;

// ctx.fillStyle = "rgb(200 0 0)";
// ctx.fillRect(10, 10, 50, 50);
// ctx.fillStyle = "rgb(0 0 200 / 50%)";
// ctx.fillRect(30, 30, 50, 50);
let canvas: HTMLElement = document.getElementById('Canvas')!;
if (canvas !== null) window.addEventListener('load', function () { grid = new ConwayGrid(canvas.clientWidth, canvas.clientHeight); grid.DrawGrid() }, false)
window.addEventListener('keydown', (e) => { grid.KeyPresses(e) })

var slider = document.getElementById("Slider");
var output = document.getElementById("SpeedOut");
var button = document.getElementById("butn");

if (button !== null) button.addEventListener('click', (e) => grid.ButtonClicked(e))
if (slider !== null) slider.addEventListener('change', (e) => grid.UpdateSpeed())


class ConwayGrid {
    interval: number;
    IntervalID: number | undefined;
    running: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
    arra: any[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    slider: HTMLInputElement;
    output: HTMLElement;
    button: HTMLElement;
    constructor(Width: number, Height: number) {
        this.interval = 2000;
        this.running = false;
        this.width = Width;
        this.height = Height;
        this.x = Math.trunc(this.width / 5);
        this.y = Math.trunc(this.height / 5);
        this.arra = this.makeArray(this.x, this.y);
        this.canvas = (document.getElementById('Canvas')! as HTMLCanvasElement);;
        if ('getContext' in this.canvas) {
            this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        }
        else {
            throw new Error("Cavas Doesnt Exist");
        }
        this.slider = document.getElementById("Slider") as HTMLInputElement;
        this.output = document.getElementById("SpeedOut")!;
        this.button = document.getElementById("butn")!;
        this.canvas.addEventListener('click', (event) => { this.ClickGrid(event); this.DrawGrid() });

        this.UpdateSpeed()
    }
    /**
     * ClickGrid
     * @param event MouseEvent
     * This function is called when the user clicks on the grid.
     * It toggles the state of the cell at the clicked position.
     */
    ClickGrid(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.trunc((event.pageX - rect.left) / 5),
            y = Math.trunc((event.pageY - rect.top - window.scrollY) / 5);
        if (this.arra[x - 1][y - 1] === 1) {
            this.arra[x - 1][y - 1] = 0;
        }
        else {
            this.arra[x - 1][y - 1] = 1;
        }

    }
    /**
     * DrawGrid
     * This function draws the grid on the canvas.
     * It iterates through the array and fills the cells based on their state.
     */
    DrawGrid() {
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (this.arra[i][j] === 1) {
                    this.ctx.fillStyle = "rgb(0 0 0)";
                }
                else {
                    this.ctx.fillStyle = "rgb(255 255 255)";
                }
                this.ctx.fillRect(5 * i, 5 * j, 5, 5);
            }
        }
    }
    /**
     * KeyPresses
     * @param e KeyboardEvent
     * This function is called when a key is pressed.
     * It checks if the key is the spacebar and toggles the running state.
     */
    KeyPresses(e: KeyboardEvent) {
        if (e.code === "Space") {
            this.ChangeRunning()
        }
    }
    /**
     * Run
     * This function starts the game loop.
     * It updates the grid based on the rules of Conway's Game of Life.
     */
    Run() {
        this.IntervalID = setInterval(() => {
            let next = this.makeArray(this.x, this.y);
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    var total = this.FindTotalSurrounding(i, j);
                    if (total < 2) {
                        next[i][j] = 0; // Underpopulation
                    } else if (total > 3) {
                        next[i][j] = 0; // overpopulation
                    } else if (total === 3) {
                        next[i][j] = 1;
                    } else if (total === 2 && this.arra[i][j] === 1) {
                        next[i][j] = 1; // stays alive
                    } else {
                        next[i][j] = 0;
                    }
                }
            }
            this.arra = next;
            //console.log(this.arra);
            this.DrawGrid();
        }, this.interval);
        // The above code runs every 2000 milliseconds, you can adjust this value for speed
    }
    /**
     * Stop
     * This function stops the game loop.
     * It clears the interval set by the Run function.
     */
    Stop() {
        clearInterval(this.IntervalID);
    }
    /**
     * UpdateSpeed
     * This function updates the speed of the game based on the slider value.
     * It changes the interval and updates the output text.
     */
    UpdateSpeed() {
        if (this.slider === null || this.output === null) return;
        console.log(this.slider.value);
        let val: number = 10 * (Number(this.slider.value) - 1);
        this.interval = val;
        this.output.innerHTML = ((val) + "ms")
        if (this.running) {
            this.Stop();
            this.Run();
        }
    }
    /**
     * ButtonClicked
     * @param e Event
     * This function is called when the button is clicked.
     * It toggles the running state of the game.
     */
    ButtonClicked(e: Event) {
        this.ChangeRunning()
    }
    /**
     * ChangeRunning
     * This function toggles the running state of the game.
     * It starts or stops the game based on the current state.
     */
    ChangeRunning() {
        this.running = !this.running
        if (this.running) {
            this.Run()
            this.button.innerText = "Stop"
        } else {
            this.Stop()
            this.button.innerText = "Start"
        }
    }

    /**
     * FindTotalSurrounding
     * @param i Row index
     * @param j Column index
     * This function calculates the total number of live cells surrounding the cell at (i, j).
     * It checks all 8 surrounding cells and returns the count.
     */
    FindTotalSurrounding(i: number, j: number) {
        let total = 0;
        [-1, 0, 1].forEach(dx => {
            [-1, 0, 1].forEach(dy => {
                total += this.GetValue(i + dx, j + dy);
            });
        });
        if (this.arra[i][j] === 1) {
            total--; // Don't count the current cell
        }
        return total;
    }
    /**
     * GetValue
     * @param x Row index
     * @param y Column index
     * This function returns the value of the cell at (x, y).
     * If the cell is out of bounds or not defined, it returns 0.
     */
    GetValue(x: number, y: number) {
        if (x < 0 || x >= this.x || y < 0 || y >= this.y) {
            return 0; // Out of bounds
        }
        if ((this.arra[x][y] !== 0 && this.arra[x][y] !== 1)) {
            return 0; //not defined
        }
        return this.arra[x][y];
    }
    /**
     * makeArray
     * @param d1 Number of rows
     * @param d2 Number of columns
     * This function creates a 2D array with the specified dimensions and fills it with zeros.
     */
    makeArray(d1: number, d2: number) {
        let finalarr = new Array(d1)
        for (let i = 0; i < d1; i++) {
            finalarr[i] = new Array(d2).fill(0);
        }
        return finalarr;
    }

    DrawGrid2(visx: number, visy: number, squareSize: number, Height: number, Width: number) {
        let startx: number = -Math.abs(((visx % squareSize) + squareSize) % squareSize);// Where the Squares Are Drawn From
        let starty: number = -Math.abs(((visy % squareSize) + squareSize) % squareSize);

        for (let i = 0; i < Math.ceil(Width / squareSize); i++) {
            for (let j = 0; j < Math.ceil(Height / squareSize); j++) {
                
            }
        }


    }
}




