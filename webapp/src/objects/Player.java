package objects;

public class Player
{
  // Instance variables
	private static int playerCount = 0;
	private final int playerID;
  private String playerName;
  private Position position;
  private int playerScore = 0;

  public Player(String desiredName, Position startPosition)
  {
	  playerCount++;
	  this.playerID = playerCount;
    this.playerName = desiredName;
    this.position = startPosition;
  } // Player

  public Player(String desiredName)
  {
	  playerCount++;
	  this.playerID = playerCount;
    Rotation playerRotation = new Rotation(0, 0, 0, 0);
    Position playerPosition = new Position(50, 50, 100, playerRotation);
    this.playerName = desiredName;
    this.position = playerPosition;
  } // Player
  
  public int getPlayerID()
  {
	  return this.playerID;
  } // getPlayerID
  
  public String getPlayerName()
  {
	  return this.playerName;
  } // getPlayerName
  
  public void setPlayerName(String playerName)
  {
	  this.playerName = playerName;
  } // setPlayerName

  public int getPlayerScore()
  {
    return this.playerScore;
  } // getPlayerScore

  public void increaseScore(int amount)
  {
    this.playerScore += amount;
  } // increaseScore

  public void decreaseScore(int amount)
  {
    this.playerScore -= amount;
  } // decreaseScore

  public Position getPosition()
  {
    return this.position;
  } // getPosition

  public void setPosition(Position newPosition)
  {
    this.position = newPosition;
  } // setPosition
} // class Player
