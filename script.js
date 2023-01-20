//class box sebagai template untuk membuat objek
class Box {
  //membuat konstruktor dengan memiliki indeks x dan y sbg arah vertikal dan horizontal pada puzzle
  constructor(x, y) {
    this.x = x;// inisialisasi sumbu x(horizontal)
    this.y = y;//inisialisasi sumbu y(vertikal)
  }

  //objek untuk mengembalikan nilai TopBox
  getTopBox() {
    if (this.y === 0) return null; //jika kondisi y bernilai 0 maka akan dikembalikan dgn nilai null
    return new Box(this.x, this.y - 1); //menampilkan box baru dengan ketentuan yg ada di dalam kurung 
  }

  //objek untuk mengembalikan nilai RightBox
  getRightBox() {
    if (this.x === 3) return null;//jika kondisi y bernilai 3 maka akan dikembalikan dgn nilai null
    return new Box(this.x + 1, this.y);//menampilkan box baru dengan ketentuan yg ada di dalam kurung
  }

  //objek untuk mengembalikan nilai BottomBox
  getBottomBox() {
    if (this.y === 3) return null;//jika kondisi y bernilai 3 maka akan dikembalikan dgn nilai null
    return new Box(this.x, this.y + 1);//menampilkan box baru dengan ketentuan yg ada di dalam kurung
  }

  //objek untuk mengembalikan nilai LeftBox
  getLeftBox() {
    if (this.x === 0) return null;//jika kondisi y bernilai 0 maka akan dikembalikan dgn nilai null
    return new Box(this.x - 1, this.y);//menampilkan box baru dengan ketentuan yg ada di dalam kurung
  }

  //objek untuk menampilkan kotak sebelah objek yg dipanggil 
  getNextdoorBoxes() {
    return [
      this.getTopBox(), //memanggil getTopBox
      this.getRightBox(), // memanggil getRightBox
      this.getBottomBox(), // memanggil getBottomBox
      this.getLeftBox() // memanggil getLeftBox
    ].filter(box => box !== null); // menyaring nilai box yg nilainya tidak sama dengan null
  }

  //objek untuk mengacak kotak
  getRandomNextdoorBox() {
    const nextdoorBoxes = this.getNextdoorBoxes(); //nilai box yg ditampilkan tidak boleh sama dengan nilai box sebelumnya
    return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)]; //menampilkan nilai pada box secara random dgn disesuaikan panjang box
  }
}

//menukar nilai box dengan mengatur tabel yang nilainya sudah diacak dan ditentukan di objek yg ada di atas
const swapBoxes = (grid, box1, box2) => {
  const temp = grid[box1.y][box1.x];
  grid[box1.y][box1.x] = grid[box2.y][box2.x];
  grid[box2.y][box2.x] = temp;
};

//Array untuk menampilkan angka 1-15
const isSolved = grid => {
  return (
    grid[0][0] === 1 &&
    grid[0][1] === 2 &&
    grid[0][2] === 3 &&
    grid[0][3] === 4 &&
    grid[1][0] === 5 &&
    grid[1][1] === 6 &&
    grid[1][2] === 7 &&
    grid[1][3] === 8 &&
    grid[2][0] === 9 &&
    grid[2][1] === 10 &&
    grid[2][2] === 11 &&
    grid[2][3] === 12 &&
    grid[3][0] === 13 &&
    grid[3][1] === 14 &&
    grid[3][2] === 15 &&
    grid[3][3] === 0
  );
};

//menampilkan angka dengan format let
const getRandomGrid = () => {
  let grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

  // Shuffle
  let blankBox = new Box(3, 3); //untuk mendeklarasikan 1 box kosong yg tidak ada angkanya
  //looping untuk mengacak nilai angka yg ada di dalam array
  for (let i = 0; i < 1000; i++) {
    const randomNextdoorBox = blankBox.getRandomNextdoorBox(); //mengkombinasikan acakan box dengan box kosong
    swapBoxes(grid, blankBox, randomNextdoorBox); //untuk menukar tabel, box kosong, dan box sebelahnya
    blankBox = randomNextdoorBox;
  }

  //uji kondisi jika tabel terpecahkan maka akan diacak kembali
  if (isSolved(grid)) return getRandomGrid();
  return grid;
};

//membuat class state
class State {
  //deklarasi kostruktor yang berisi grid, move, time, dan status
  constructor(grid, move, time, status) {
    this.grid = grid;//deklarasi tabel
    this.move = move;//deklarasi move
    this.time = time;//deklarasi time
    this.status = status;//deklarasi status
  }

  //ready ketika puzzle bernilai null
  static ready() {
    return new State(
      [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      0,
      0,
      "ready"
    );
  }

  //melakukan start ketika awal main
  static start() {
    return new State(getRandomGrid(), 0, 0, "playing");
  }
}

//class game sebagai template untuk membuat objek
class Game {
  //memanggil konstruktor state (angka acak)
  constructor(state) {
    this.state = state; //deklarasi state
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();//memanggil render
    this.handleClickBox = this.handleClickBox.bind(this);//memindahkan tiap angka pada puzzle dengan mengklik angkanya
  }

  static ready() {
    return new Game(State.ready());
  }

  tick() {
    this.setState({ time: this.state.time + 1 });
  }

  //setting state(angka acak)
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();//menampilkan angka acak
  }

  //mengatur ketika klik box
  handleClickBox(box) {
    return function () {
      const nextdoorBoxes = box.getNextdoorBoxes(); //menampung pada nextdoorBoxes
      //mengeksekusi array
      const blankBox = nextdoorBoxes.find(
        nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
      );
      //mengatur box yang kosong
      if (blankBox) {
        const newGrid = [...this.state.grid];
        swapBoxes(newGrid, box, blankBox); //menampilkan tabel baru, box angka dan 1 box yg kosong
        if (isSolved(newGrid)) { //jika puzzle terpecahkan
          clearInterval(this.tickId); //menghentikan timer
          //set state
          this.setState({
            status: "won", //jika status won/ menang
            grid: newGrid, //menampilkan tabel baru
            move: this.state.move + 1 //mengatur jika dilakukan klik sekali maka status move akan bertambah 1
          });
        } else {
          this.setState({
            grid: newGrid, //menampilkan tabel baru
            move: this.state.move + 1 //mengatur jika dilakukan klik sekali maka status move akan bertambah 1
          });
        }
      }
    }.bind(this);
  }

  render() {
    const { grid, move, time, status } = this.state;

    // Render grid
    const newGrid = document.createElement("div");//membuat elemen botton
    newGrid.className = "grid"; //membuat class grid baru bernama "grid"
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const button = document.createElement("button");//membuat elemen botton

        //ketika kondisi playing maka button dapat di klik
        if (status === "playing") {
          button.addEventListener("click", this.handleClickBox(new Box(j, i)));//untuk membuat event klik box
        }

        button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString(); //mengubah tipe data array menjadi string
        newGrid.appendChild(button); //menyematkan objek button pada tag HTML untuk ditampilkan di browser
      }
    }
    document.querySelector(".grid").replaceWith(newGrid); //mengembalikan elemen grid yang cocok dan mengganti dgn elemen baru

    // Render button
    const newButton = document.createElement("button");
    if (status === "ready") newButton.textContent = "Play"; //botton play ditampilkan ketika puzzle ready dan masih blm berisi angka
    if (status === "playing") newButton.textContent = "Reset"; //botton reset ditampilkan ketika dalam permainan ingin mengacak lagi angka dlm puzzle
    if (status === "won") newButton.textContent = "Play"; //memunculkan botton ready ketika puzzle berhasil diurutkan/ menang
    newButton.addEventListener("click", () => {
      clearInterval(this.tickId);
      this.tickId = setInterval(this.tick, 1000);
      this.setState(State.start());
    });
    document.querySelector(".footer button").replaceWith(newButton);//membuat button

    // Render move
    document.getElementById("move").textContent = `Move: ${move}`;//menampilkan tulisan move pada bawah puzzle

    // Render time
    document.getElementById("time").textContent = `Time: ${time}`; //menampilkan tulisan move pada bawah puzzle

    // Render message
    if (status === "won") {
      document.querySelector(".message").textContent = "You win!";//menampilkan tulisan You win ketika berhasil menyusun puzzle dgn urut
    } else {
      document.querySelector(".message").textContent = "";//tidak menampilkan apapun ketika puzzle belum urut
    }
  }
}

const GAME = Game.ready();
