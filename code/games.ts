import { account, session, update_user } from "./accounts";
import * as PromptSync from "prompt-sync";
const prompt: PromptSync.Prompt = PromptSync();

const MAX_LINES = 3;
const MAX_BET = 100;
const MIN_BET = 1;

const ROWS = 3;
const COLS = 3;

const symbolCount: { [key: string]: number } = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const symbolValue: { [key: string]: number } = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

function getSlotMachineSpin(
  rows: number,
  cols: number,
  symbols: { [key: string]: number },
): string[][] {
  const allSymbols: string[] = [];
  // Populate the allSymbols array based on the frequency in symbols.
  for (const symbol in symbols) {
    for (let i = 0; i < symbols[symbol]; i++) {
      allSymbols.push(symbol);
    }
  }

  const columns: string[][] = [];
  for (let i = 0; i < cols; i++) {
    const column: string[] = [];
    // Copy the available symbols for this column.
    const currentSymbols = [...allSymbols];
    for (let j = 0; j < rows; j++) {
      const randomIndex = Math.floor(Math.random() * currentSymbols.length);
      const value = currentSymbols[randomIndex];
      // Remove the selected symbol so it isn't reused in this column.
      currentSymbols.splice(randomIndex, 1);
      column.push(value);
    }
    columns.push(column);
  }
  return columns;
}

function printSlotMachine(columns: string[][]): void {
  // Print row by row
  for (let row = 0; row < columns[0].length; row++) {
    let rowStr = "";
    for (let i = 0; i < columns.length; i++) {
      rowStr += columns[i][row];
      if (i !== columns.length - 1) {
        rowStr += " | ";
      }
    }
    console.log(rowStr);
  }
}

function checkWinnings(
  columns: string[][],
  lines: number,
  bet: number,
  values: { [key: string]: number },
): { winnings: number; winningLines: number[] } {
  let winnings = 0;
  const winningLines: number[] = [];

  for (let line = 0; line < lines; line++) {
    const symbol = columns[0][line];
    let won = true;
    for (const column of columns) {
      if (column[line] !== symbol) {
        won = false;
        break;
      }
    }
    if (won) {
      winnings += values[symbol] * bet;
      winningLines.push(line + 1);
    }
  }
  return { winnings, winningLines };
}

function deposit(): number {
  while (true) {
    const amountStr = prompt("What would you like to deposit? €");
    const amount = parseInt(amountStr);
    if (!isNaN(amount)) {
      if (amount > 0) {
        return amount;
      } else {
        console.log("Amount must be greater than 0");
      }
    } else {
      console.log("Please enter a number");
    }
  }
}

function getNumberOfLines(): number {
  while (true) {
    const linesStr = prompt(
      `Enter the number of lines to bet on (1-${MAX_LINES}): `,
    );
    const lines = parseInt(linesStr);
    if (!isNaN(lines)) {
      if (lines >= 1 && lines <= MAX_LINES) {
        return lines;
      } else {
        console.log("Enter a valid number of lines.");
      }
    } else {
      console.log("Please enter a number");
    }
  }
}

function getBet(): number {
  while (true) {
    const amountStr = prompt("What would you like to bet on each line? €");
    const amount = parseInt(amountStr);
    if (!isNaN(amount)) {
      if (amount >= MIN_BET && amount <= MAX_BET) {
        return amount;
      } else {
        console.log(`Amount must be between €${MIN_BET} - €${MAX_BET}.`);
      }
    } else {
      console.log("Please enter a number");
    }
  }
}

export function main(user_session: session): void {
  let balance = user_session[0].savings;

  while (true) {
    console.log(`Your current balance is €${balance}`);
    const lines = getNumberOfLines();

    let bet: number;
    let totalBet: number;
    while (true) {
      bet = getBet();
      totalBet = bet * lines;

      if (totalBet > balance) {
        console.log(
          `You do not have enough to bet that amount, your current balance is €${balance}`,
        );
      } else {
        break;
      }
    }

    console.log(
      `You are betting €${bet} on ${lines} lines. Total bet is equal to: €${totalBet}`,
    );

    const slots = getSlotMachineSpin(ROWS, COLS, symbolCount);
    printSlotMachine(slots);

    const { winnings, winningLines } = checkWinnings(
      slots,
      lines,
      bet,
      symbolValue,
    );
    console.log(`You won €${winnings}`);
    if (winningLines.length > 0) {
      console.log(`You won on lines: ${winningLines.join(", ")}`);
    }

    balance += winnings - totalBet;
    user_session[0].savings = balance;

    if (balance <= 0) {
      console.log("You have run out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again? (y/n): ");
    if (playAgain.toLowerCase() !== "y") {
      break;
    }
  }

  console.log(`You left the game with €${balance}`);
  update_user(user_session);
}
