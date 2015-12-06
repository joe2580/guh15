package objects;

import java.nio.ByteBuffer;

public class Position
{
	// Instance Variables
	private float xCoordinate;
	private float yCoordinate;
	private float zCoordinate;
	private Rotation rotation;

	public Position(float xPos, float yPos, float zPos, Rotation rotationRequired)
	{
		this.xCoordinate = xPos;
		this.yCoordinate = yPos;
		this.zCoordinate = zPos;
		this.rotation = rotationRequired;
	} // Position

	public float getxCoordinate()
	{
		return xCoordinate;
	} // getxCoordinate

	public void setxCoordinate(float xCoordinate)
	{
		this.xCoordinate = xCoordinate;
	} // setxCoordinate

	public float getyCoordinate()
	{
		return yCoordinate;
	} // getyCoordinate

	public void setyCoordinate(float yCoordinate)
	{
		this.yCoordinate = yCoordinate;
	} // setyCoordinate

	public float getzCoordinate()
	{
		return zCoordinate;
	} // getzCoordinate

	public void setzCoordinate(float zCoordinate)
	{
		this.zCoordinate = zCoordinate;
	} // setzCoordinate
	
	public Rotation getRotation()
	{
		return this.rotation;
	} // getRotation
	
	public ByteBuffer toByteBuffer()
	{
		byte[] xBytes = ByteBuffer.allocate(4).putFloat(this.xCoordinate).array();
		byte[] yBytes = ByteBuffer.allocate(4).putFloat(this.yCoordinate).array();
		byte[] zBytes = ByteBuffer.allocate(4).putFloat(this.zCoordinate).array();
		
		byte[] bytes = new byte[28];
    	ByteBuffer buffer = ByteBuffer.wrap(bytes);
    	return buffer.put(xBytes).put(yBytes).put(zBytes).put(this.rotation.toByteBuffer());
	} // toByteBuffer
} // class Position
