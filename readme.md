# Solution
## What can be used for the row key?
In this case, we have a unique column family, this is why we could consider the FOOD_CODE family to be the row key.  
If this wasn't unique, we could possibly combine multiple column families to form a row key.

## What column family options make sense for this data?
We have arrenged the data in the following column families:

|FOOD_CODE|DISPLAY_NAME|PORTION|CALCULATIONS|NUTRITION|VEGETABLES|CALORIES|ALCOHOL|OTHERS|
|---|---|---|---|---|---|---|---|---|
|Food_Code|Display_Name|Default<br/>Amount<br/>Display_Name|Factor<br/>Increment<br/>Multiplier|Grains<br/>Whole_Grains<br/>Soy<br/>Drybeans_Peas<br/>Oils<br/>Saturated_Fats<br/>Added_Sugars<br/>Solid_Fats|Vegetables<br/>Orange<br/>Drkgreen<br/>Starchy<br/>Other|Calories|Alcohol|Fruits<br/>Milk<br/>Meats|

## Create code for importing the food data into the new table.
```typescript
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
```

## Using the HBase shell, query the foods table for information about your favourite foods.


### Install HBase

docker run --name=hbase-docker -d -p 8080:8080 dajobe/hbase

### To access the console

docker exec -it hbase-docker sh
... when you get prompted into the container run the following command:
hbase shell

### Run the program

npm install
npm start
