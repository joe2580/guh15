package webSocket;

import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import objects.Player;
import objects.Position;
import objects.Rotation;
import objects.Target;

@ServerEndpoint("/gameManager")
public class GameManager
{
	private final Player player;
	private static final List<GameManager> playerConnections = new ArrayList<GameManager>();
	private Session playerSession;
	private static List<Target> currentTargets = new ArrayList<Target>();
	private static final int score = 10;

    public GameManager()
    {
		this.player = new Player("NewUser");
		playerConnections.add(this);
    } // GameManager

    @OnOpen
    public void playerConnect(Session session)
    {
        this.playerSession = session;
        addPlayer();
    } // playerConnect

    @OnClose
    public void end()
    {
    	messageAll("Player '" + this.player.getPlayerName() + "' has disconnected.");
    	deletePlayer();
    	playerConnections.remove(this);
    } // end

    @OnMessage
    public void incoming(ByteBuffer incomingMessage)
    {
    	char firstChar = incomingMessage.getChar();
    	
    	switch(firstChar)
    	{
    	case 'N': // Name
    		String playerName = new String(incomingMessage.array(), Charset.forName("UTF-8")); // TODO
    		this.player.setPlayerName(playerName);
    		System.out.println("Player name set: " + this.player.getPlayerName());
    		break;
    	case 'L': // Load new player position
    		
    		float xPos = incomingMessage.getFloat();
    		float yPos = incomingMessage.getFloat();
    		float zPos = incomingMessage.getFloat();
    		
    		float xRot = incomingMessage.getFloat();
    		float yRot = incomingMessage.getFloat();
    		float zRot = incomingMessage.getFloat();
    		float wRot = incomingMessage.getFloat();
    		
    		Rotation newRotation = new Rotation(xRot, yRot, zRot, wRot);
    		Position newPosition = new Position(xPos, yPos, zPos, newRotation);
    		
    		this.player.setPosition(newPosition);
    		System.out.println("New data about player ," + this.player.getPlayerName() +"' position.");
    		break;
    	case 'G': // Player has got a target
    		int targetID = incomingMessage.getInt();
    		playerGetTarget(targetID);
    		System.out.println("Player '" + this.player.getPlayerName() + "' got a target.");
    		break;
    	case 'K': // Player has been killed
    		end();
    		System.out.println("Player '" + this.player.getPlayerName() + "' died.");
    		break;
    	default:
    	} // switch
    	
    	if (currentTargets.size() < 3)
    		generateTarget();
    } // incoming

    @OnError
    public void onError(Throwable t) throws Throwable
    {
    	messageAll("Player '" + this.player.getPlayerName() + "' has errored.");
    	deletePlayer();
    	playerConnections.remove(this);
    } // onError
    
    public void generateTarget()
    {
    	Target newTarget = new Target(score);
    	// TODO: SEND NEWTARGET TO CLIENT
    }
    
    private void playerGetTarget(int targetID)
    {
    	Target completedTarget = null;
    	for (Target target : currentTargets)
    	{
    		if (target.getTargetID() == targetID)
    		{
    			this.player.increaseScore(target.getScore());
    			completedTarget = target;
    		} // if
    	} // for
    	if (completedTarget != null)
    		currentTargets.remove(completedTarget);
    } // playerGetTarget
    
    private void addPlayer()
    {
    	byte[] charBytes = ByteBuffer.allocate(2).putChar('A').array();
    	byte[] playerIDBytes = ByteBuffer.allocate(4).putInt(this.player.getPlayerID()).array();
    	byte[] playerNameBytes = this.player.getPlayerName().getBytes();
    	byte[] bytes = new byte[(6 + playerNameBytes.length)];
    	ByteBuffer buffer = ByteBuffer.wrap(bytes);
    	buffer.put(charBytes).put(playerIDBytes).put(playerNameBytes);
    	
    	messageAllOther(buffer);
    }
    
    private void deletePlayer()
    {
    	byte[] charBytes = ByteBuffer.allocate(2).putChar('D').array();
    	byte[] playerIDBytes = ByteBuffer.allocate(4).putInt(this.player.getPlayerID()).array();
    	byte[] bytes = new byte[6];
    	ByteBuffer buffer = ByteBuffer.wrap(bytes);
    	buffer.put(charBytes).put(playerIDBytes);
    	
    	messageAllOther(buffer);
    }
    
    private void updatePlayerPosition()
    {
    	byte[] charBytes = ByteBuffer.allocate(2).putChar('P').array();
    	byte[] playerIDBytes = ByteBuffer.allocate(4).putInt(this.player.getPlayerID()).array();
    	byte[] playerPositionBytes = this.player.getPosition().toByteBuffer().array();
    	byte[] bytes = new byte[34];
    	ByteBuffer buffer = ByteBuffer.wrap(bytes);
    	buffer.put(playerIDBytes).put(playerPositionBytes);
    	
    	messageAllOther(buffer);
    }
    
    private void messageAll(String message)
    {
    	for(GameManager eaTest : playerConnections)
    	{
    		if(eaTest == this)
    			continue;
    		try
    		{
    			eaTest.playerSession.getBasicRemote().sendText(message);
    		} // try
    		catch (Exception ex)
    		{
    			ex.printStackTrace();
    		} // catch
    	}
    } // messageAll
    
    private void messageAllOther(String message)
    {
    	for(GameManager eaTest : playerConnections)
    	{
    		try
    		{
    			eaTest.playerSession.getBasicRemote().sendText(message);
    		} // try
    		catch (Exception ex)
    		{
    			ex.printStackTrace();
    		} // catch
    	}
    } // messageAllOther
    
    private void messageAll(ByteBuffer message)
    {
    	for(GameManager eaTest : playerConnections)
    	{
    		if(eaTest == this)
    			continue;
    		try
    		{
    			eaTest.playerSession.getBasicRemote().sendBinary(message);
    		} // try
    		catch (Exception ex)
    		{
    			ex.printStackTrace();
    		} // catch
    	}
    } // messageAll
    
    private void messageAllOther(ByteBuffer message)
    {
    	for(GameManager eaTest : playerConnections)
    	{
    		try
    		{
    			eaTest.playerSession.getBasicRemote().sendBinary(message);
    		} // try
    		catch (Exception ex)
    		{
    			ex.printStackTrace();
    		} // catch
    	}
    } // messageAllOther
} // class GameManager
