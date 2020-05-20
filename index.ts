import * as fs from "fs";
import { parseString } from "xml2js";
import * as hbase from "hbase";

/* Table name */
const FOOD_DISPLAY_TABLE = "Food Display Table";
/* Column families */
const FOOD_CODE = "Food_Code";
const DISPLAY_NAME = "Display_Name";
const PORTION = "Portion"; // containing 'Default', 'Amount' and 'Display_Name'
const CALCULATIONS = "Calculations"; // containing 'Factor', 'Increment' and 'Multiplier'
const NUTRITION = "Nutrition"; // containing 'Grains', 'Whole_Grains', 'Soy', 'Drybeans_Peas', 'Oils', 'Saturated_Fats', 'Added_Sugars' and 'Solid_Fats'
const VEGETABLES = "Vegetables"; // containing 'Vegetables', 'Orange', 'Drkgreen', 'Starchy', 'Other'
const CALORIES = "Calories";
const ALCOHOL = "Alcohol";
const OTHERS = "Others"; // containing 'Fruits', 'Milk' and 'Meats'

const client = hbase({ host: "127.0.0.1", port: 8080 });

fs.readFile(
  "./Food_Display_Table.xml",
  { encoding: "UTF-8" },
  (error, data) => {
    parseString(data, (err, data) => {
      if (error === null) {
        const foods: IFood[] = data.Food_Display_Table.Food_Display_Row;

        const cells: IFood[] = [];

        for (let index = 0; index < foods.length; index++) {
          Object.keys(foods[index]).forEach(item => {
            const key = item;
            const value = foods[index][key];
            const currCell: any = {};
            currCell.column = `cf:${key}`;
            currCell["$"] = value;
            cells.push(currCell);
          });

          client
            .table("Food_Display_Table")
            .row(index)
            .put(cells, (error, success) => {});
        }
      }
    });
  }
);

interface IFood {
  Food_Code: string;
  Display_Name: string;
  Portion_Default: string;
  Portion_Amount: string;
  Portion_Display_Name: string;
  Factor: string;
  Increment: string;
  Multiplier: string;
  Grains: string;
  Whole_Grains: string;
  Vegetables: string;
  Orange_Vegetables: string;
  Drkgreen_Vegetables: string;
  Starchy_vegetables: string;
  Other_Vegetables: string;
  Fruits: string;
  Milk: string;
  Meats: string;
  Soy: string;
  Drybeans_Peas: string;
  Oils: string;
  Solid_Fats: string;
  Added_Sugars: string;
  Alcohol: string;
  Calories: string;
  Saturated_Fats: string;
}
