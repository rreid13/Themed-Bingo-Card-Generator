import java.util.ArrayList;
import java.io.*;

public class Main {

    public static String cardType = "humanBingo";
    public static String filename = "categories/" + cardType + ".txt";

    public static void main(String[] args) {

        ArrayList<String> options = readFile(filename);
        int numberOfCards = 100;
        BingoGenerator generator = new BingoGenerator(options);
        ArrayList<BingoCard> cards = generator.generateCards(numberOfCards);
        CSVExporter.export(
                cards,
                "output/" + cardType + ".csv");
        generator.printUsage();
    }

    public static void printCategory(ArrayList<String> options) {

        for (int i = 0; i < options.size(); i++) {
            System.out.println(options.get(i));
        }

    }

    public static void duplicateCheck(ArrayList<String> options) {
        boolean duplicates = false;
        for (int i = 0; i < options.size(); i++) {
            for (int j = 0; j < i; j++) {
                if (options.get(i) == options.get(j)) {
                    System.out.println("duplicate: " + options.get(i));
                    duplicates = true;
                }
            }
        }
        if (duplicates == false) {
            System.out.println("no duplicates found");
        }
    }

    public static ArrayList<String> readFile(String filename) {
        File file = new File(filename);
        ArrayList<String> options = new ArrayList<String>();
        try {
            FileReader fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);

            String line = br.readLine();
            while (line != null) {
                options.add(line);
                line = br.readLine();
            }

            br.close();
            fr.close();

        } catch (IOException e) {
            System.out.println("File Error");
            e.printStackTrace();
        }

        return options;

    }
}