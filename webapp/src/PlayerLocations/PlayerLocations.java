/*
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package PlayerLocations;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/test")
public class PlayerLocations
{
    private static final String GUEST_PREFIX = "Guest";
    private static final AtomicInteger connectionIds = new AtomicInteger(0);
    private static final Set<PlayerLocations> connections =
            new CopyOnWriteArraySet<>();

    private final String nickname;
    private Session session;

    public PlayerLocations()
    {
        nickname = GUEST_PREFIX + connectionIds.getAndIncrement();
    }
    
    @OnOpen
    public void start(Session session)
    {
        this.session = session;
    }


    @OnClose
    public void end()
    {
    }


    @OnMessage
    public void incoming(String message)
    {
    	try
    	{
    		session.getBasicRemote().sendText(message);
    	}
    	catch (Exception ex)
    	{
    		ex.printStackTrace();
    	}
    }
    
    @OnError
    public void onError(Throwable t) throws Throwable
    {
    }
}