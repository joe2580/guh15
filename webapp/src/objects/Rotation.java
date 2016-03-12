package objects;

import java.nio.ByteBuffer;

public class Rotation
{
	// Instance Variables
	private float xRotation, yRotation, zRotation, wRotation;

	public Rotation(float xRot, float yRot, float zRot, float wRot)
	{
		this.xRotation = xRot;
		this.yRotation = yRot;
		this.zRotation = zRot;
		this.wRotation = wRot;
	} // Rotation

	public float getX()
	{
		return xRotation;
	} // getX

	public void setX(float xRotation)
	{
		this.xRotation = xRotation;
	} // setX

	public float getY()
	{
		return yRotation;
	} // getY

	public void setY(float yRotation)
	{
		this.yRotation = yRotation;
	} // setY

	public float getZ()
	{
		return zRotation;
	} // getZ

	public void setZ(float zRotation)
	{
		this.zRotation = zRotation;
	} // setZ

	public float getW()
	{
		return wRotation;
	} // getD

	public void setW(float w)
	{
		this.wRotation = w;
	} // setD
	
	public ByteBuffer toByteBuffer()
	{
		byte[] xBytes = ByteBuffer.allocate(4).putFloat(this.xRotation).array();
		byte[] yBytes = ByteBuffer.allocate(4).putFloat(this.yRotation).array();
		byte[] zBytes = ByteBuffer.allocate(4).putFloat(this.zRotation).array();
		byte[] wBytes = ByteBuffer.allocate(4).putFloat(this.wRotation).array();
		
		byte[] bytes = new byte[16];
    	ByteBuffer buffer = ByteBuffer.wrap(bytes);
    	return buffer.put(xBytes).put(yBytes).put(zBytes).put(wBytes);
	} // toByteBuffer
} // class Rotation
