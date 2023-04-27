<template>
  <div class="calc shadow-2">
    <q-btn
      class="q-mt-sm"
      size="sm"
      dense
      flat
      label="Go back form version"
      type="submit"
      color="primary"
      @click="$emit('demoVersion', false)"
    />
    <span class="text-red text-caption"
      >*This version will not affect your credit balance and doesn't have any
      server integration</span
    >
    <div class="display">
      <DisplayScreen :displayValue="displayValue" />
      <ResultScreen :resultValue="resultValue" />
    </div>
    <div class="keypad">
      <div class="keypad-row">
        <ButtonCalc label="AC" value="AC" doubleSpace @handleClick="cleanAll" />
        <ButtonCalc @handleClick="clean">
          <template v-slot:icon>
            <q-icon name="backspace" />
          </template>
        </ButtonCalc>
        <ButtonCalc label="÷" value="/" operation @handleClick="setOperation" />
      </div>
      <div class="keypad-row">
        <ButtonCalc label="7" value="7" @handleClick="digit" />
        <ButtonCalc label="8" value="8" @handleClick="digit" />
        <ButtonCalc label="9" value="9" @handleClick="digit" />
        <ButtonCalc label="x" value="*" operation @handleClick="setOperation" />
      </div>
      <div class="keypad-row">
        <ButtonCalc label="4" value="4" @handleClick="digit" />
        <ButtonCalc label="5" value="5" @handleClick="digit" />
        <ButtonCalc label="6" value="6" @handleClick="digit" />
        <ButtonCalc label="-" value="-" operation @handleClick="setOperation" />
      </div>
      <div class="keypad-row">
        <ButtonCalc label="1" value="1" @handleClick="digit" />
        <ButtonCalc label="2" value="2" @handleClick="digit" />
        <ButtonCalc label="3" value="3" @handleClick="digit" />
        <ButtonCalc label="+" value="+" operation @handleClick="setOperation" />
      </div>
      <div class="keypad-row">
        <ButtonCalc label="0" value="0" @handleClick="digit" />
        <ButtonCalc label="." value="." @handleClick="digit" />
        <ButtonCalc label="+/-" @handleClick="changeSign" />
        <ButtonCalc label="=" value="=" operation @handleClick="equal" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DisplayScreen from "./DisplayScreen.vue";
import ResultScreen from "./ResultScreen.vue";
import ButtonCalc from "./Button.vue";

export default defineComponent({
  name: "CalculatorComponent",
  components: {
    DisplayScreen,
    ResultScreen,
    ButtonCalc,
  },
  data: function () {
    return {
      displayValue: "0",
      resultValue: "",
      values: [""],
      maxDigit: false,
      operation: false,
      sign: false,
      err: false,
    };
  },
  methods: {
    digit(digit) {
      if (digit === "." && this.values[this.values.length - 1].includes("."))
        return;
      if (this.values[this.values.length - 1].indexOf(".") !== -1) {
        const decimal = this.values[this.values.length - 1].indexOf(".");
        if (decimal - (this.values[this.values.length - 1].length - 1) === -3)
          return;
      }
      this.displayValue =
        this.displayValue === "0" && digit === "."
          ? this.displayValue + digit
          : this.displayValue === "0" && digit !== "."
          ? digit
          : this.displayValue.slice(-1) === " " && digit === "."
          ? this.displayValue + "0" + digit
          : this.displayValue + digit;
      this.values = this.displayValue.split(/([-+*/])/g);
      if (this.values.length >= 3) this.equation();
    },
    setOperation(op) {
      this.operation = true;
      this.maxDigit = false;
      if (this.operation) {
        if (["+", "-", "*", "/"].includes(this.displayValue.slice(-1))) {
          const valueReplaced = this.displayValue
            .slice(-1)
            .replace(this.displayValue.slice(-1), op);
          this.displayValue = this.displayValue.slice(0, -1) + valueReplaced;
          return;
        }
        this.displayValue = `${this.displayValue}${op}`;
        const values = this.displayValue.split(/([-+*/])/g);
        this.values = values.filter((v) => v);
      }
    },
    equation() {
      if (this.operation) {
        if (["+", "-", "*", "/"].includes(this.displayValue.slice(-1))) return;
        const value = eval(this.displayValue);
        const result = Number.isInteger(value)
          ? value.toString()
          : value.toFixed(3).toString();
        this.resultValue = parseFloat(result).toString();
      }
    },
    equal() {
      if (["+", "-", "*", "/"].includes(this.displayValue.slice(-1))) return;
      const value = eval(this.displayValue);
      const result = Number.isInteger(value)
        ? value.toString()
        : value.toFixed(3).toString();
      this.displayValue = parseFloat(result).toString();
      this.values = this.displayValue.split(/([-+*/])/g);
      this.resultValue = "";
    },
    changeSign() {
      if (["+", "-", "*", "/"].includes(this.displayValue.slice(-1))) return;
      if (this.displayValue === "0") return;
      const value = this.values[this.values.length - 1];
      const indexValue = this.values.length - 1;
      const sign = Math.sign(value);
      if (sign === 1) {
        this.values = this.values.map((e, index) => {
          return index === indexValue ? `(-${value})` : e;
        });
      } else {
        this.values = this.values.map((e, index) => {
          return index === indexValue ? value.match(/[\d.]+/g).pop() : e;
        });
      }
      this.displayValue = this.values.join("");
      this.equation();
    },
    clean() {
      if (this.displayValue.length === 0) return;
      this.displayValue = this.displayValue.substr(
        0,
        this.displayValue.length - 1
      );
      this.values = this.displayValue.split(/([-+*/])/g);
      this.values = this.values.filter((item) => item);
      if (this.values.length === 0) this.values = [""];
      if (this.displayValue.length < 1) this.displayValue = "0";
      if (this.values.length < 3) this.resultValue = "";
      if (this.values.length >= 3) this.equation();
    },
    cleanAll() {
      this.displayValue = "0";
      this.resultValue = "";
      this.values = [""];
      this.maxDigit = false;
      this.operation = false;
      this.sign = false;
    },
  },
});
</script>
<style>
.calc {
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 460px;
  border-radius: 8px;
  background-color: #cdcdcd;
  overflow: hidden;
}
.display {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 140px;
  background-color: #09203f;
  padding: 10px;
}
.keypad {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.keypad-row {
  display: flex;
  flex-direction: row;
  height: 64px;
  width: 100%;
}
</style>
