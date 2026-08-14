import java.io.*;
import java.util.ArrayList;

public class CSVExporter {
    public static void export(ArrayList<BingoCard> cards, String filename) {

        try {
            File file = new File(filename);
            FileWriter fw = new FileWriter(file);
            BufferedWriter bw = new BufferedWriter(fw);

            bw.write("Card");

            for (int i = 1; i <= 24; i++) {
                bw.write(", Square " + i);
            }

            bw.newLine();

            for (int cardNumber = 0; cardNumber < cards.size(); cardNumber++) {
                BingoCard card = cards.get(cardNumber);
                bw.write("Card " + (cardNumber + 1));
                for (String option : card.getItems()) {
                    bw.write("," + option);
                }
                bw.newLine();
            }
            bw.close();
            fw.close();
        } catch (IOException e) {
            System.out.println("Error writing CSV");
            e.printStackTrace();
        }
    }
}
