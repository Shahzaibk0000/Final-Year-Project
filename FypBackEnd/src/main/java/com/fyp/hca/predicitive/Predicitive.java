//package com.fyp.hca.predicitive;
//
//import org.apache.spark.SparkConf;
//import org.apache.spark.api.java.JavaRDD;
//import org.apache.spark.api.java.JavaSparkContext;
//import org.apache.spark.sql.*;
//
//// Import MLlib packages
//import org.apache.spark.ml.Pipeline;
//import org.apache.spark.ml.PipelineModel;
//import org.apache.spark.ml.feature.VectorAssembler;
//import org.apache.spark.ml.regression.*;
//import org.apache.spark.ml.feature.VectorAssembler;
//import org.apache.spark.ml.linalg.Vector;
//import org.apache.spark.ml.linalg.Vectors;
//import org.apache.spark.sql.types.DataTypes;
//import org.apache.spark.sql.types.Metadata;
//import org.apache.spark.sql.types.StructField;
//import org.apache.spark.sql.types.StructType;
//
//import java.util.Collections;
//
//public class Predictive
//    public static void main(String[] args) {
//        // Create Spark configuration and Spark context
//        SparkConf conf = new SparkConf().setAppName("CountPrediction").setMaster("local[*]");
//        JavaSparkContext sc = new JavaSparkContext(conf);
//        SQLContext sqlContext = new SQLContext(sc);
//
//        // Load CSV file into DataFrame
//        Dataset<Row> df = sqlContext.read().format("csv")
//                .option("header", "true")
//                .option("inferSchema", "true")
//                .load("D:\\latest\\fyp-backend\\temp.csv");
//
//        // Show the schema of the DataFrame
//        df.printSchema();
//
//        // Convert Date column to timestamp type
//        df = df.withColumn("Date", functions.to_date(df.col("Date"), "dd/MM/yyyy"));
//
//        // Feature engineering: Extract day of year as a feature
//        df = df.withColumn("DayOfYear", functions.dayofyear(df.col("Date")));
//
//        // Prepare data for MLlib
//        VectorAssembler assembler = new VectorAssembler()
//                .setInputCols(new String[]{"DayOfYear"})
//                .setOutputCol("features");
//
//        Dataset<Row> assembledData = assembler.transform(df).select("features", "count");
//
//        // Split the data into training and test sets (you can modify this as needed)
//        Dataset<Row>[] splits = assembledData.randomSplit(new double[]{0.7, 0.3});
//        Dataset<Row> trainingData = splits[0];
//        Dataset<Row> testData = splits[1];
//
//        // Train a regression model
//        DecisionTreeRegressor dt = new DecisionTreeRegressor()
//                .setLabelCol("count")
//                .setFeaturesCol("features");
//
//        // Train model
//        DecisionTreeRegressionModel model = dt.fit(trainingData);
//
//        StructType schema = new StructType(new StructField[]{
//                new StructField("Date", DataTypes.DateType, false, Metadata.empty())
//        });
//
//
//        // Predict next count based on a new date (example date)
//        Row newRow = RowFactory.create(java.sql.Date.valueOf("2024-06-01"));
//        Dataset<Row> newData = sqlContext.createDataFrame(Collections.singletonList(newRow), schema);
//        Dataset<Row> transformedNewData = assembler.transform(newData);
//
//        Dataset<Row> predictions = model.transform(transformedNewData);
//
//        // Show prediction
//        predictions.show();
//
//        // Stop Spark context
//        sc.stop();
//    }
//}