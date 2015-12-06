package objects;

import java.nio.ByteBuffer;
import java.util.Random;

public class Target
{
	private static int targetCount = 0;
	
	private final int targetID;
	private Position position;
	private int score;
	//private long generationTime = new Date().getTime();
	
	public Target(Position positionRequired, int scoreRequired)
	{
		targetCount++;
		this.targetID = targetCount;
		this.position = positionRequired;
		this.score = scoreRequired;
	} // Target
	
	public Target(int scoreRequired)
	{
		targetCount++;
		this.targetID = targetCount;
		this.score = scoreRequired;
		
		int max = 100;
		int min = 0;
		Random random = new Random();
		
		int xRand = random.nextInt(max - min + 1) + min;
		int yRand = random.nextInt(max - min + 1) + min;
		int zRand = random.nextInt(150 - 30 + 1) + 30;
		
		int yRot = random.nextInt(max - min + 1) + min;
		
		this.position = new Position(xRand, yRand, zRand, new Rotation(0, yRot, 0, 0));
	} // Target
	
	public int getTargetID()
	{
		return this.targetID;
	}
	
	public Position getPosition()
	{
		return this.position;
	} // getPosition
	
	public int getScore()
	{
		return this.score;
	} // getScore
} // class Target
