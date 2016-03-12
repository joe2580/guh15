package webSocket;

import java.util.ArrayList;
import java.util.List;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import objects.Player;

@ServerEndpoint("/test")
public class Test
{
	private final Player player;
	private boolean setName = false;
	private static final List<Test> connections = new ArrayList<>();
	private Session playerSession;

    public Test()
    {
		this.player = new Player("");
		connections.add(this);
    }

    @OnOpen
    public void playerConnect(Session session)
    {
        this.playerSession = session;
    }
    
    private void messageAll(String message)
    {
    	for(Test eaTest : connections)
    	{
    		try
    		{
    			eaTest.playerSession.getBasicRemote().sendText(message);
    		}
    		catch (Exception ex)
    		{
    			
    		}
    	}
    }
    
    private void messageAllNotYou(String message)
    {
    	for(Test eaTest : connections)
    	{
    		if (eaTest == this)
    			continue;
    		try
    		{
    			eaTest.playerSession.getBasicRemote().sendText(message);
    		}
    		catch (Exception ex)
    		{
    			
    		}
    	}
    }

    @OnClose
    public void end()
    {
    	
    } // end

    @OnMessage
    public void incoming(String message)
    {
    	if (!setName)
    	{
    		this.player.setPlayerName(message);
    		this.setName = !setName;
    		messageAll("Player " + this.player.getPlayerName() + " has connected.");
    		return;
    	} // if
    	
    	messageAllNotYou(message);
    } // incoming

    @OnError
    public void onError(Throwable t) throws Throwable
    {
    	
    }
}
