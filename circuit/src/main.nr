// use dep::std;

// global puzzle = [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; // for testing

// fn main(solution: [[u8; 4]; 4], puzzle: pub [[u8; 4]; 4]) -> pub bool {
//     check_puzzle(solution, puzzle) & check_lines(solution)
// }

// // check the solution matches the puzzle
// fn check_puzzle(solution: [[u8; 4]; 4], puzzle: [[u8; 4]; 4]) -> bool {
//     for i in 0..4 {
//         for j in 0..4 {
//             assert(
//                 (puzzle[i][j] == 0) | (solution[i][j] == puzzle[i][j]), "Solution does not match the puzzle!"
//             );
//         }
//     }
//     true
// }

// // check there are no duplicates per row and per column
// fn check_lines(solution: [[u8; 4]; 4]) -> bool {
//     for i in 0..4 {
//         // check rows
//         assert(solution[i].sort() == [1, 2, 3, 4], "Invalid row");

//         // check columns
//         let mut column = [solution[0][i], solution[1][i], solution[2][i], solution[3][i]];
//         assert(column.sort() == [1, 2, 3, 4], "Invalid column");
//     }
//     true
// }

use dep::std;

global puzzle = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]; // for testing

fn main(solution: [[u8; 9]; 9], puzzle: pub [[u8; 9]; 9]) -> pub bool {
    check_puzzle(solution, puzzle) & check_lines(solution)
}

// check the solution matches the puzzle
fn check_puzzle(solution: [[u8; 9]; 9], puzzle: [[u8; 9]; 9]) -> bool {
    for i in 0..9 {
        for j in 0..9 {
            assert(
                (puzzle[i][j] == 0) | (solution[i][j] == puzzle[i][j]), "Solution does not match the puzzle!"
            );
        }
    }
    true
}

// check there are no duplicates per row and per column
fn check_lines(solution: [[u8; 9]; 9]) -> bool {
    for i in 0..9 {
        // check rows
        assert(solution[i].sort() == [1, 2, 3, 4, 5, 6, 7, 8, 9], "Invalid row");

        // check columns
        let mut column = [
            solution[0][i], solution[1][i], solution[2][i], solution[3][i], solution[4][i], solution[5][i], solution[6][i], solution[7][i], solution[8][i]
        ];
        assert(column.sort() == [1, 2, 3, 4, 5, 6, 7, 8, 9], "Invalid column");
    }
    true
}

#[test]
fn test_main() {
    let solution = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];
    assert(main(solution, puzzle) == true, "Main function failed");
}

#[test(should_fail)]
fn test_check_puzzle() {
    let bad_solution = [
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    check_puzzle(bad_solution, puzzle);
}
#[test(should_fail)]
fn test_check_row() {
    let bad_row = [
        [1, 2, 6, 4, 5, 6, 7, 8, 9],
        [4, 5, 3, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];
    check_lines(bad_row);
}

#[test(should_fail)]
fn test_check_column() {
    let bad_column = [
        [1, 3, 2, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];
    check_lines(bad_column);
}
