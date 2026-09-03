import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Collections;

public class BingoGenerator {

    private ArrayList<String> options;
    private HashMap<String, Integer> usageCount;
    private HashSet<String> generatedCards;

    public BingoGenerator(ArrayList<String> options) {

        this.options = options;

        usageCount = new HashMap<>();
        generatedCards = new HashSet<>();

        for (String option : options) {
            usageCount.put(option, 0);
        }
    }

    public ArrayList<BingoCard> generateCards(int numberOfCards) {

        ArrayList<BingoCard> cards = new ArrayList<>();

        while (cards.size() < numberOfCards) {

            BingoCard card = generateCard();

            if (card != null) {
                cards.add(card);
            }
        }

        return cards;
    }

    private BingoCard generateCard() {

        ArrayList<String> available = new ArrayList<>(options);
        ArrayList<String> cardItems = new ArrayList<>();

        // Choose 24 items

        while (cardItems.size() < 24) {

            String chosen = chooseItem(available);

            cardItems.add(chosen);

            available.remove(chosen);
        }

        // Randomise positions

        Collections.shuffle(cardItems);

        // Create card signature

        String signature = createSignature(cardItems);

        // Reject exact duplicate

        if (generatedCards.contains(signature)) {
            return null;
        }

        // Record card

        generatedCards.add(signature);

        // Update usage counts

        for (String item : cardItems) {

            usageCount.put(
                    item,
                    usageCount.get(item) + 1);
        }

        return new BingoCard(cardItems);
    }

    private String chooseItem(ArrayList<String> available) {

        int highestUsage = 0;

        // Find highest current usage

        for (String option : available) {

            int usage = usageCount.get(option);

            if (usage > highestUsage) {
                highestUsage = usage;
            }
        }

        // Calculate total weight

        int totalWeight = 0;

        for (String option : available) {

            int usage = usageCount.get(option);

            int weight = highestUsage - usage + 1;

            totalWeight += weight;
        }

        // Pick random number within total weight

        int randomNumber = (int) (Math.random() * totalWeight);

        // Find which option was selected

        int currentWeight = 0;

        for (String option : available) {

            int usage = usageCount.get(option);

            int weight = highestUsage - usage + 1;

            currentWeight += weight;

            if (randomNumber < currentWeight) {
                return option;
            }
        }

        return available.get(available.size() - 1);
    }

    private String createSignature(ArrayList<String> items) {

        return String.join("|", items);

    }

    public void printUsage() {

        for (String option : options) {

            System.out.println(
                    option + ": " + usageCount.get(option));
        }
    }
}