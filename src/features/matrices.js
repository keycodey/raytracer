const EPSILON = 0.00001;

const matrix2x2 = (e) => {
  return [
    [e[0], e[1]],
    [e[2], e[3]]
  ];
};

const matrix3x3 = (e) => {
  return [
    [e[0], e[1], e[2]],
    [e[3], e[4], e[5]],
    [e[6], e[7], e[8]]
  ];
};

const matrix4x4 = (e) => {
  return [
    [e[0], e[1], e[2], e[3]],
    [e[4], e[5], e[6], e[7]],
    [e[8], e[9], e[10], e[11]],
    [e[12], e[13], e[14], e[15]]
  ];
};

const matricesEqual = (A, B) => {
  // square matrices; see if the number of rows in A and B are not equal
  if (A.length != B.length) {
    return false;
  }

  for (let row = 0; row < A.length; row++) {
    for (let col = 0; col < A[row].length; col++) {
      if (!(Math.abs(A[row][col] - B[row][col]) < EPSILON)) {
        return false;
      }
    }
  }

  return true;
};

const matrix_multiply = (A, B) => {
  const M = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      M[row][col] =
        A[row][0] * B[0][col] +
        A[row][1] * B[1][col] +
        A[row][2] * B[2][col] +
        A[row][3] * B[3][col];
    }
  }

  return M;
};

const matrix_vector_multiply = (A, v) => {
  const x = [0, 0, 0, 0];

  for (let row = 0; row < 4; row++) {
    x[row] =
      A[row][0] * v[0] + A[row][1] * v[1] + A[row][2] * v[2] + A[row][3] * v[3];
  }

  return x;
};

const identity_matrix = () => {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
};

const transpose = (A) => {
  return [
    [A[0][0], A[1][0], A[2][0], A[3][0]],
    [A[0][1], A[1][1], A[2][1], A[3][1]],
    [A[0][2], A[1][2], A[2][2], A[3][2]],
    [A[0][3], A[1][3], A[2][3], A[3][3]]
  ];
};

const determinant = (M) => {
  let det = 0;

  if (M.length == 2) {
    det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  } else {
    for (let col = 0; col < M.length; col++) {
      det = det + M[0][col] * cofactor(M, 0, col);
    }
  }

  return det;
};

const submatrix = (A, r, c) => {
  let M;
  if (A.length == 4) {
    M = matrix3x3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  if (A.length == 3) {
    M = matrix2x2([0, 0, 0, 0]);
  }
  let i = 0;
  for (let row = 0; row < A.length; row++) {
    if (row == r) {
      continue;
    }
    let j = 0;
    for (let col = 0; col < A[row].length; col++) {
      if (col == c) {
        continue;
      }
      M[i][j] = A[row][col];
      j++;
    }
    i++;
  }
  return M;
};

const minor = (A, row, col) => {
  const M = submatrix(A, row, col);
  return determinant(M);
};

const cofactor = (A, row, col) => {
  let sign = -1;
  if ((row + col) % 2 == 0) {
    sign = 1;
  }
  const M = submatrix(A, row, col);
  return sign * determinant(M);
};

const inverse = (M) => {
  // if (determinant(M) == 0) {
  //   console.log("The given matrix is not invertible");
  //   return;
  // }

  const det = determinant(M);
  const M2 = matrix4x4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  for (let row = 0; row < M.length; row++) {
    for (let col = 0; col < M.length; col++) {
      const c = cofactor(M, row, col);
      M2[col][row] = c / det; // (col, row) instead of (row, col) => transpose
    }
  }

  return M2;
};

export {
  matrix2x2,
  matrix3x3,
  matrix4x4,
  matricesEqual,
  matrix_multiply,
  matrix_vector_multiply,
  identity_matrix,
  transpose,
  determinant,
  submatrix,
  minor,
  cofactor,
  inverse
};
