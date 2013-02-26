package com;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import difflib.Delta;
import difflib.Patch;

public class DiffServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected final void doPost(final HttpServletRequest request,
			final HttpServletResponse response) throws ServletException,
			IOException {

		final String firstFile = request.getParameter("input1");
		final String secondFile = request.getParameter("input2");

		final List<String> firstFileList = convetToList(firstFile);
		final List<String> secondFileList = convetToList(secondFile);
		
		System.out.println(firstFileList+"\n"+secondFileList);
		

		final DiffLibrary diff = new DiffLibrary();
		final Patch deltaPatch = diff.recieveFiles(firstFileList,
				secondFileList);

		final JSONArray jArray = getResult(deltaPatch, new JSONArray(),
				firstFileList, secondFileList);

		response.setContentType("text/html");
		response.setHeader("Access-Control-Allow-Origin", "*");
		final PrintWriter out = response.getWriter();
		out.print(jArray);
	}

	public final List<String> convetToList(final String file1) {
		final List<String> listInput = new LinkedList<String>();
		try {
			String eachLine;

			final JSONArray jsonInput = new JSONArray(file1);
			for (int i = 0; i < jsonInput.length(); i++) {
				eachLine = jsonInput.get(i).toString()
						.replaceAll("( )+", " ");
				if (!eachLine.isEmpty()) {
					listInput.add(eachLine);
				}
			}
		} catch (JSONException e) {
			java.util.logging.Logger.getLogger(DiffServlet.class.getName())
					.log(java.util.logging.Level.SEVERE, null, e);
		}
		return listInput;
	}

	public final JSONArray getResult(final Patch deltaPatch,
			final JSONArray jArray, final List<String> firstFileList,
			final List<String> secondFileList) {
		try {
			for (int i = 0; i < deltaPatch.getDeltas().size(); i++) {
				final Delta delta = deltaPatch.getDeltas().get(i);
				jArray.put(i,
						deltaAsObject(delta, firstFileList, secondFileList));
			}
		} catch (JSONException e) {
			java.util.logging.Logger.getLogger(DiffServlet.class.getName())
					.log(java.util.logging.Level.SEVERE, null, e);
		}
		return jArray;
	}

	public final JSONObject deltaAsObject(final Delta delta,
			final List<String> firstFileList, final List<String> secondFileList) {
		final JSONObject objectDelta = new JSONObject();
		try {
			// obj.put("first1", delta.getOriginal().getPosition());
			// obj.put("last1", delta.getOriginal().last());
			// obj.put("size1", delta.getOriginal().size());
			// obj.put("first2", delta.getRevised().getPosition());
			// obj.put("last2", delta.getRevised().last());
			// obj.put("size2", delta.getRevised().size());
			objectDelta.put("operation", decideOperation(delta));
			System.out.println(createDelta(delta));
			objectDelta.put("delta", createDelta(delta));
		} catch (JSONException e) {
			java.util.logging.Logger.getLogger(DiffServlet.class.getName())
					.log(java.util.logging.Level.SEVERE, null, e);
		}
		return objectDelta;
	}

	public String decideOperation(final Delta delta) {

		String operation;
		if (delta.getOriginal().size() == 0) {
			operation = "a";
		} else if (delta.getRevised().size() == 0) {
			operation = "d";
		} else {
			operation = "c";
		}
		return operation;
	}

	public String createDelta(final Delta delta) {

		String deltaPattern;
		final String operation = decideOperation(delta);

		if ("a".equals(operation)) {
			deltaPattern = addDelta(delta);
		} else if ("d".equals(operation)) {
			deltaPattern = deleteDelta(delta);
		} else {
			deltaPattern = changeDelta(delta);
		}

		return deltaPattern;
	}

	public String addDelta(final Delta delta) {

		String deltaPattern;
		if (delta.getRevised().size() > 1) {
			deltaPattern = (delta.getOriginal().getPosition())
					+ "a"
					+ (delta.getRevised().getPosition())
					+ ","
					+ (delta.getRevised().getPosition() + delta.getRevised()
							.size() - 1);
		} else {
			deltaPattern = (delta.getOriginal().getPosition()) + "a"
					+ (delta.getRevised().getPosition());
		}
		return deltaPattern;
	}

	public final String deleteDelta(final Delta delta) {

		String deltaPattern;
		if (delta.getOriginal().size() > 1) {
			deltaPattern = (delta.getOriginal().getPosition())
					+ ","
					+ (delta.getOriginal().getPosition() + delta.getOriginal()
							.size() - 1) + "d" + (delta.getRevised().getPosition());
		} else {
			deltaPattern = (delta.getOriginal().getPosition()) + "d"
					+ (delta.getRevised().getPosition());
		}
		return deltaPattern;
	}

	public String changeDelta(final Delta delta) {
		
		String deltaPattern;
		if (delta.getOriginal().size() > 1 && delta.getRevised().size() > 1) {
			deltaPattern = (delta.getOriginal().getPosition() ) + ","
					+ (delta.getOriginal().getPosition() + delta.getOriginal() .size() - 1) + "c"
					+ (delta.getRevised().getPosition() ) + ","
					+ (delta.getRevised().getPosition() + delta.getRevised().size() - 1);
		} else if (delta.getOriginal().size() == 1
				&& delta.getRevised().size() == 1) {
			deltaPattern = (delta.getOriginal().getPosition() ) + "c"
					+ (delta.getRevised().getPosition() );
		} else if (delta.getOriginal().size() > 1
				&& delta.getRevised().size() == 1) {
			deltaPattern = (delta.getOriginal().getPosition() ) + "," 
				    + (delta.getOriginal().getPosition() + delta.getOriginal().size() - 1) + "c"
					+ (delta.getRevised().getPosition() );
		} else {
			deltaPattern = (delta.getOriginal().getPosition() ) + "c" 
		            + (delta.getRevised().getPosition() ) + ","
					+ (delta.getRevised().getPosition() + delta.getRevised().size() - 1);
		}
		return deltaPattern;
	}
}
